using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerce.Application.DTOs.Orders;
using ECommerce.Application.Features.Orders.Commands.PlaceOrder;
using ECommerce.Application.Features.Orders.Queries.GetOrders;
using ECommerce.Application.Features.Orders.Commands.UpdateOrderStatus;

namespace ECommerce.API.Controllers
{
    [ApiController, Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IMediator _mediator;
        public OrdersController(IMediator mediator) => _mediator = mediator;

        [HttpPost]
        public async Task<ActionResult<Guid>> Place(PlaceOrderRequest request)
        {
            var id = await _mediator.Send(new PlaceOrderCommand
            {
                ShippingAddress = request.ShippingAddress,
                PaymentMethod = request.PaymentMethod
            });
            return Ok(id);
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> Get() => Ok(await _mediator.Send(new GetOrdersQuery()));

        [Authorize(Roles = "Seller,Admin")]
        [HttpPatch("{orderId}/status")]
        public async Task<ActionResult> UpdateStatus(Guid orderId, [FromBody] OrderStatusUpdateRequest request)
        {
            await _mediator.Send(new UpdateOrderStatusCommand { OrderId = orderId, Status = request.Status });
            return NoContent();
        }
    }

    public class OrderStatusUpdateRequest
    {
        public ECommerce.Domain.Enums.OrderStatus Status { get; set; }
    }
}