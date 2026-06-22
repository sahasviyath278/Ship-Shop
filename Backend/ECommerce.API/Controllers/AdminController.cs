using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerce.Application.Features.Admin.Commands.ManageUser;
using ECommerce.Application.Features.Admin.Queries.GetUsers;
using ECommerce.Application.Features.Admin.Queries.GetStatistics;

namespace ECommerce.API.Controllers
{
    [ApiController, Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IMediator _mediator;
        public AdminController(IMediator mediator) => _mediator = mediator;
        
        [HttpGet("users")]
        public async Task<ActionResult<List<UserDto>>> GetUsers()
        {
            var users = await _mediator.Send(new GetUsersQuery());
            return Ok(users);
        }

        [HttpPut("users/{userId}")]
        public async Task<ActionResult> ManageUser(Guid userId, ManageUserRequest request)
        {
            await _mediator.Send(new ManageUserCommand
            {
                UserId = userId,
                IsActive = request.IsActive,
                Role = request.Role
            });
            return NoContent();
        }

        [HttpGet("statistics")]
        public async Task<ActionResult<StatisticsDto>> GetStats() =>
            Ok(await _mediator.Send(new GetStatisticsQuery()));
    }

    public class ManageUserRequest
    {
        public bool? IsActive { get; set; }
        public string? Role { get; set; }
    }
}