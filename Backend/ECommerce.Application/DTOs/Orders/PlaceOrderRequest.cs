namespace ECommerce.Application.DTOs.Orders
{
    public class PlaceOrderRequest
    {
        public string ShippingAddress { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = "CashOnDelivery";
    }
}