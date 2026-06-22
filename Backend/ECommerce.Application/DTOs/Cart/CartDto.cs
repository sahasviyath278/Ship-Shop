namespace ECommerce.Application.DTOs.Cart
{
    public class CartDto
    {
        public Guid Id { get; set; }
        public List<CartItemDto> Items { get; set; } = new();
        public decimal TotalPrice => Items.Sum(i => i.UnitPrice * i.Quantity);
    }

    public class CartItemDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public string? ImageUrl { get; set; }
    }
}