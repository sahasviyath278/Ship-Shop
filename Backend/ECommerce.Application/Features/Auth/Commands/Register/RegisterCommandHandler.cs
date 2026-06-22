using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.DTOs.Auth;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Enums;
using ECommerce.Application.Exceptions;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace ECommerce.Application.Features.Auth.Commands.Register
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
    {
        private readonly IApplicationDbContext _context;
        private readonly ITokenService _tokenService;

        public RegisterCommandHandler(IApplicationDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                throw new ValidationException("Email already registered.");

            if (!Enum.TryParse<UserRole>(request.Role, true, out var role) || role == UserRole.Admin)
                throw new ValidationException("Invalid role. Choose Buyer or Seller.");

            var user = new User
            {
                Email = request.Email,
                FullName = request.FullName,
                PasswordHash = HashPassword(request.Password),
                Role = role,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync(cancellationToken);

            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshTokenStr = _tokenService.GenerateRefreshToken();
            var refreshToken = new ECommerce.Domain.Entities.RefreshToken
            {
                UserId = user.Id,
                Token = refreshTokenStr,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync(cancellationToken);

            return new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshTokenStr,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role.ToString()
            };
        }

        private string HashPassword(string password)
        {
            byte[] salt = new byte[128 / 8];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(salt);
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));
            return $"{Convert.ToBase64String(salt)}.{hashed}";
        }
    }
}