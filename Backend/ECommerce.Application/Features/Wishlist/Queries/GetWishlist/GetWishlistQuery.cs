using MediatR;
using ECommerce.Application.DTOs.Products;

namespace ECommerce.Application.Features.Wishlist.Queries.GetWishlist
{
    public class GetWishlistQuery : IRequest<List<ProductDto>> { }
}