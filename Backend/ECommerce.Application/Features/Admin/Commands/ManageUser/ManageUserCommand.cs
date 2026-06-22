using MediatR;

namespace ECommerce.Application.Features.Admin.Commands.ManageUser
{
    public class ManageUserCommand : IRequest
    {
        public Guid UserId { get; set; }
        public bool? IsActive { get; set; }
        public string? Role { get; set; }
    }
}