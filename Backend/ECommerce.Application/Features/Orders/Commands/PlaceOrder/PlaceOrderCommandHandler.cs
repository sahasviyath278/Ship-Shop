using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Enums;
using ECommerce.Application.Exceptions;

namespace ECommerce.Application.Features.Orders.Commands.PlaceOrder
{
    public class PlaceOrderCommandHandler : IRequestHandler<PlaceOrderCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public PlaceOrderCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<Guid> Handle(PlaceOrderCommand request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            var cart = await _context.Carts
                .Include(c => c.Items).ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

            if (cart == null || !cart.Items.Any())
                throw new ValidationException("Cart is empty.");

            var order = new Order
            {
                UserId = userId,
                Status = OrderStatus.Pending,
                ShippingAddress = request.ShippingAddress,
                PaymentMethod = request.PaymentMethod
            };

            foreach (var item in cart.Items)
            {
                var product = item.Product;
                if (product.StockQuantity < item.Quantity)
                    throw new ValidationException($"Not enough stock for {product.Name}.");

                product.StockQuantity -= item.Quantity;
                order.Items.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                });
            }

            order.TotalAmount = order.Items.Sum(i => i.UnitPrice * i.Quantity);
            _context.Orders.Add(order);
            _context.Carts.Remove(cart); // clear cart

            await _context.SaveChangesAsync(cancellationToken);
            return order.Id;
        }
    }
}