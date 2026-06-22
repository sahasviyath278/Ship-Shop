using ECommerce.Domain.Enums;

namespace ECommerce.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public Guid SellerId { get; set; }
        public User Seller { get; set; } = null!;
        public string ImageUrls { get; set; } = string.Empty; // comma separated
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}