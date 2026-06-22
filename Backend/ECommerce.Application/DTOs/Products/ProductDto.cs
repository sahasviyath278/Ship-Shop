namespace ECommerce.Application.DTOs.Products
{
    public class ProductDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public Guid SellerId { get; set; }
        public string SellerName { get; set; } = string.Empty;
        public List<string> ImageUrls { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }
    }
}