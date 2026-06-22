using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Exceptions;

namespace ECommerce.Application.Features.Cart.Commands.RemoveFromCart
{
    public class RemoveFromCartCommandHandler : IRequestHandler<RemoveFromCartCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public RemoveFromCartCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task Handle(RemoveFromCartCommand request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            var cart = await _context.Carts
                           .Include(c => c.Items)
                           .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken)
                       ?? throw new NotFoundException(nameof(Cart), userId);

            var item = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);
            if (item != null)
                cart.Items.Remove(item);

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}