using MediatR;
using ECommerce.Application.DTOs.Products;

namespace ECommerce.Application.Features.Products.Queries.GetProducts
{
    public class GetProductsQuery : IRequest<PagedResult<ProductDto>>
    {
        public string? Search { get; set; }
        public Guid? CategoryId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? SortBy { get; set; } = "name";
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 12;
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}