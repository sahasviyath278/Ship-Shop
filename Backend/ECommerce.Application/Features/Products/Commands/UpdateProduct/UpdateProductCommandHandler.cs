using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Exceptions;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Features.Products.Commands.UpdateProduct
{
    public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public UpdateProductCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _context.Products.FindAsync(new object[] { request.Id }, cancellationToken);
            if (product == null)
                throw new NotFoundException(nameof(Product), request.Id);

            // Check ownership or admin
            if (product.SellerId != _currentUserService.UserId && _currentUserService.Role != "Admin")
                throw new UnauthorizedException("You can only edit your own products.");

            product.Name = request.Name;
            product.Description = request.Description;
            product.Price = request.Price;
            product.StockQuantity = request.StockQuantity;
            product.CategoryId = request.CategoryId;
            product.ImageUrls = string.Join(",", request.ImageUrls);

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}