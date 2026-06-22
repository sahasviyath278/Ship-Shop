using MediatR;
using ECommerce.Application.DTOs.Auth;

namespace ECommerce.Application.Features.Auth.Commands.Register
{
    public class RegisterCommand : IRequest<AuthResponse>
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "Buyer";
    }
}