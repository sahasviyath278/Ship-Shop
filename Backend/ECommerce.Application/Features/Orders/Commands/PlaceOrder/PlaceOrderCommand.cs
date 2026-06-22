using MediatR;

namespace ECommerce.Application.Features.Orders.Commands.PlaceOrder
{
    public class PlaceOrderCommand : IRequest<Guid>
    {
        public string ShippingAddress { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = "CashOnDelivery";
    }
}