using MediatR;
using ECommerce.Application.DTOs.Auth;

namespace ECommerce.Application.Features.Auth.Commands.RefreshToken
{
    public class RefreshTokenCommand : IRequest<AuthResponse>
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
    }
}