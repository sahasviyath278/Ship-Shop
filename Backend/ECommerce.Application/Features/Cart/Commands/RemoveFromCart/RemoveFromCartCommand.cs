using MediatR;

namespace ECommerce.Application.Features.Cart.Commands.RemoveFromCart
{
    public class RemoveFromCartCommand : IRequest
    {
        public Guid ProductId { get; set; }
    }
}