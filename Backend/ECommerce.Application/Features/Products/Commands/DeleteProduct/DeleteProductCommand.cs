using MediatR;

namespace ECommerce.Application.Features.Products.Commands.DeleteProduct
{
    public class DeleteProductCommand : IRequest
    {
        public Guid Id { get; set; }
    }
}