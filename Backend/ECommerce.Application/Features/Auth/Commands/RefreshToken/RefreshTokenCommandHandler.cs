using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.DTOs.Auth;
using ECommerce.Domain.Entities;
using ECommerce.Application.Exceptions;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace ECommerce.Application.Features.Auth.Commands.RefreshToken
{
    public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponse>
    {
        private readonly IApplicationDbContext _context;
        private readonly ITokenService _tokenService;

        public RefreshTokenCommandHandler(IApplicationDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<AuthResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            var principal = GetPrincipalFromExpiredToken(request.AccessToken);
            if (principal == null) throw new UnauthorizedException("Invalid access token.");

            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) throw new UnauthorizedException();

            var storedToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken && rt.UserId == Guid.Parse(userId));

            if (storedToken == null || storedToken.IsRevoked || storedToken.Expires < DateTime.UtcNow)
                throw new UnauthorizedException("Invalid or expired refresh token.");

            // revoke old token
            storedToken.IsRevoked = true;
            storedToken.ReplacedByToken = _tokenService.GenerateRefreshToken();

            var newRefreshToken = new ECommerce.Domain.Entities.RefreshToken
            {
                UserId = storedToken.UserId,
                Token = storedToken.ReplacedByToken,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            _context.RefreshTokens.Add(newRefreshToken);
            await _context.SaveChangesAsync(cancellationToken);

            var newAccessToken = _tokenService.GenerateAccessToken(storedToken.User);
            return new AuthResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken.Token,
                Email = storedToken.User.Email,
                FullName = storedToken.User.FullName,
                Role = storedToken.User.Role.ToString()
            };
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtSettings = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                    System.Text.Encoding.UTF8.GetBytes("YOUR_JWT_SECRET_KEY_AT_LEAST_32_CHARS")),
                ValidateLifetime = false // we ignore expiration
            };
            try
            {
                var principal = tokenHandler.ValidateToken(token, jwtSettings, out _);
                return principal;
            }
            catch
            {
                return null;
            }
        }
    }
}