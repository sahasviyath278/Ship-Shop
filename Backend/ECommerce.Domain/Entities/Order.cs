using ECommerce.Domain.Enums;

namespace ECommerce.Domain.Entities
{
    public class Order
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string ShippingAddress { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = "CashOnDelivery";

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}