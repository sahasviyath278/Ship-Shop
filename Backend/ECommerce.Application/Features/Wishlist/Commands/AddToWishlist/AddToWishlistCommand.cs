using MediatR;

namespace ECommerce.Application.Features.Wishlist.Commands.AddToWishlist
{
    public class AddToWishlistCommand : IRequest
    {
        public Guid ProductId { get; set; }
    }
}