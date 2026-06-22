using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerce.Application.DTOs.Products;
using ECommerce.Application.Features.Products.Queries.GetProducts;
using ECommerce.Application.Features.Products.Queries.GetProductById;
using ECommerce.Application.Features.Products.Commands.CreateProduct;
using ECommerce.Application.Features.Products.Commands.UpdateProduct;
using ECommerce.Application.Features.Products.Commands.DeleteProduct;

namespace ECommerce.API.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ProductsController(IMediator mediator) => _mediator = mediator;

        [HttpGet]
        public async Task<ActionResult<PagedResult<ProductDto>>> Get([FromQuery] GetProductsQuery query) =>
            Ok(await _mediator.Send(query));

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetById(Guid id) =>
            Ok(await _mediator.Send(new GetProductByIdQuery { Id = id }));

        [Authorize(Roles = "Seller")]
        [HttpPost]
        public async Task<ActionResult<Guid>> Create(CreateProductRequest request)
        {
            var id = await _mediator.Send(new CreateProductCommand
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                StockQuantity = request.StockQuantity,
                CategoryId = request.CategoryId,
                ImageUrls = request.ImageUrls
            });
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [Authorize(Roles = "Seller,Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, UpdateProductRequest request)
        {
            await _mediator.Send(new UpdateProductCommand
            {
                Id = id,
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                StockQuantity = request.StockQuantity,
                CategoryId = request.CategoryId,
                ImageUrls = request.ImageUrls
            });
            return NoContent();
        }

        [Authorize(Roles = "Seller,Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteProductCommand { Id = id });
            return NoContent();
        }
    }
}