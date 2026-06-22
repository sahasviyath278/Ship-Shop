using MediatR;
using ECommerce.Application.DTOs.Cart;

namespace ECommerce.Application.Features.Cart.Queries.GetCart
{
    public class GetCartQuery : IRequest<CartDto>
    {
        // user extracted from token
    }
}