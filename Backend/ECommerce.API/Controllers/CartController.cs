using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerce.Application.DTOs.Cart;
using ECommerce.Application.Features.Cart.Queries.GetCart;
using ECommerce.Application.Features.Cart.Commands.AddToCart;
using ECommerce.Application.Features.Cart.Commands.RemoveFromCart;

namespace ECommerce.API.Controllers
{
    [ApiController, Route("api/[controller]")]
    [Authorize(Roles = "Buyer")]
    public class CartController : ControllerBase
    {
        private readonly IMediator _mediator;
        public CartController(IMediator mediator) => _mediator = mediator;

        [HttpGet]
        public async Task<ActionResult<CartDto>> Get() => Ok(await _mediator.Send(new GetCartQuery()));

        [HttpPost("add")]
        public async Task<ActionResult> Add(AddToCartRequest request)
        {
            await _mediator.Send(new AddToCartCommand { ProductId = request.ProductId, Quantity = request.Quantity });
            return Ok();
        }

        [HttpDelete("remove/{productId}")]
        public async Task<ActionResult> Remove(Guid productId)
        {
            await _mediator.Send(new RemoveFromCartCommand { ProductId = productId });
            return NoContent();
        }
    }
}