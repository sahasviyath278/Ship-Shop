using MediatR;
using ECommerce.Application.DTOs.Products;

namespace ECommerce.Application.Features.Products.Queries.GetProductById
{
    public class GetProductByIdQuery : IRequest<ProductDto>
    {
        public Guid Id { get; set; }
    }
}