using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Exceptions;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Features.Cart.Commands.AddToCart
{
    public class AddToCartCommandHandler : IRequestHandler<AddToCartCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public AddToCartCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task Handle(AddToCartCommand request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

            if (cart == null)
            {
                cart = new ECommerce.Domain.Entities.Cart { UserId = userId };
                _context.Carts.Add(cart);
            }

            var product = await _context.Products.FindAsync(new object[] { request.ProductId }, cancellationToken);
            if (product == null) throw new NotFoundException(nameof(Product), request.ProductId);
            if (product.StockQuantity < request.Quantity) throw new ValidationException("Not enough stock.");

            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);
            if (existingItem != null)
                existingItem.Quantity += request.Quantity;
            else
                cart.Items.Add(new CartItem { ProductId = request.ProductId, Quantity = request.Quantity });

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}