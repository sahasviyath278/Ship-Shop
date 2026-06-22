using MediatR;
using Microsoft.AspNetCore.Mvc;
using ECommerce.Application.DTOs.Auth;
using ECommerce.Application.Features.Auth.Commands.Register;
using ECommerce.Application.Features.Auth.Commands.Login;
using ECommerce.Application.Features.Auth.Commands.RefreshToken;

namespace ECommerce.API.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;
        public AuthController(IMediator mediator) => _mediator = mediator;

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            var command = new RegisterCommand
            {
                Email = request.Email,
                Password = request.Password,
                FullName = request.FullName,
                Role = request.Role
            };
            return Ok(await _mediator.Send(command));
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            return Ok(await _mediator.Send(new LoginCommand { Email = request.Email, Password = request.Password }));
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponse>> Refresh(RefreshTokenCommand command)
        {
            return Ok(await _mediator.Send(command));
        }
    }
}