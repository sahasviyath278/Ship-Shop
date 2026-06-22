using MediatR;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Exceptions;
using ECommerce.Domain.Enums;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Features.Admin.Commands.ManageUser
{
    public class ManageUserCommandHandler : IRequestHandler<ManageUserCommand>
    {
        private readonly IApplicationDbContext _context;

        public ManageUserCommandHandler(IApplicationDbContext context) => _context = context;

        public async Task Handle(ManageUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FindAsync(new object[] { request.UserId }, cancellationToken)
                       ?? throw new NotFoundException(nameof(User), request.UserId);

            if (request.IsActive.HasValue)
                user.IsActive = request.IsActive.Value;
            if (request.Role != null)
            {
                if (!Enum.TryParse<UserRole>(request.Role, out var role))
                    throw new ValidationException("Invalid role.");
                user.Role = role;
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}