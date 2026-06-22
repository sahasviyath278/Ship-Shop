using MediatR;
using ECommerce.Domain.Enums;

namespace ECommerce.Application.Features.Orders.Commands.UpdateOrderStatus
{
    public class UpdateOrderStatusCommand : IRequest
    {
        public Guid OrderId { get; set; }
        public OrderStatus Status { get; set; }
    }
}