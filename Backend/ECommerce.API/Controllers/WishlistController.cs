using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerce.Application.DTOs.Products;
using ECommerce.Application.Features.Wishlist.Commands.AddToWishlist;
using ECommerce.Application.Features.Wishlist.Queries.GetWishlist;

namespace ECommerce.API.Controllers
{
    [ApiController, Route("api/[controller]")]
    [Authorize(Roles = "Buyer")]
    public class WishlistController : ControllerBase
    {
        private readonly IMediator _mediator;
        public WishlistController(IMediator mediator) => _mediator = mediator;

        [HttpGet]
        public async Task<ActionResult<List<ProductDto>>> Get() => Ok(await _mediator.Send(new GetWishlistQuery()));

        [HttpPost("{productId}")]
        public async Task<ActionResult> Add(Guid productId)
        {
            await _mediator.Send(new AddToWishlistCommand { ProductId = productId });
            return NoContent();
        }
    }
}