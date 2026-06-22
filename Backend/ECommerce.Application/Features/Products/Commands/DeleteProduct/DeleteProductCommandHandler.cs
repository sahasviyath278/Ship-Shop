using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Exceptions;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Features.Products.Commands.DeleteProduct
{
    public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public DeleteProductCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task Handle(DeleteProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _context.Products.FindAsync(new object[] { request.Id }, cancellationToken);
            if (product == null)
                throw new NotFoundException(nameof(Product), request.Id);

            if (product.SellerId != _currentUserService.UserId && _currentUserService.Role != "Admin")
                throw new UnauthorizedException("You can only delete your own products.");

            _context.Products.Remove(product);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}