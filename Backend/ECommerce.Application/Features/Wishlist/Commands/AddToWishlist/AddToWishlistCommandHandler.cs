using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Features.Wishlist.Commands.AddToWishlist
{
    public class AddToWishlistCommandHandler : IRequestHandler<AddToWishlistCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public AddToWishlistCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task Handle(AddToWishlistCommand request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            var exists = await _context.WishlistItems.AnyAsync(w => w.UserId == userId && w.ProductId == request.ProductId);
            if (!exists)
            {
                _context.WishlistItems.Add(new WishlistItem { UserId = userId, ProductId = request.ProductId });
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}