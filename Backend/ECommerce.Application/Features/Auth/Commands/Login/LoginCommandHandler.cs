using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.DTOs.Auth;
using ECommerce.Domain.Entities;
using ECommerce.Application.Exceptions;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace ECommerce.Application.Features.Auth.Commands.Login
{
    public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
    {
        private readonly IApplicationDbContext _context;
        private readonly ITokenService _tokenService;

        public LoginCommandHandler(IApplicationDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
                throw new UnauthorizedException("Invalid credentials.");

            if (!user.IsActive)
                throw new UnauthorizedException("Account is suspended.");

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

        private bool VerifyPassword(string password, string storedHash)
        {
            var parts = storedHash.Split('.');
            if (parts.Length != 2) return false;
            var salt = Convert.FromBase64String(parts[0]);
            var hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));
            return hash == parts[1];
        }
    }
}