using MediatR;

namespace ECommerce.Application.Features.Cart.Commands.AddToCart
{
    public class AddToCartCommand : IRequest
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; } = 1;
    }
}