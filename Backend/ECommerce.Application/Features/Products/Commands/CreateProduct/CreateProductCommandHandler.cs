using MediatR;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Application.Exceptions;

namespace ECommerce.Application.Features.Products.Commands.CreateProduct
{
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public CreateProductCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var sellerId = _currentUserService.UserId;
            if (sellerId == Guid.Empty)
                throw new UnauthorizedException();

            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                StockQuantity = request.StockQuantity,
                CategoryId = request.CategoryId,
                SellerId = sellerId,
                ImageUrls = string.Join(",", request.ImageUrls)
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync(cancellationToken);
            return product.Id;
        }
    }
}