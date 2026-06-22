using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Exceptions;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Features.Orders.Commands.UpdateOrderStatus
{
    public class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public UpdateOrderStatusCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
        {
            var order = await _context.Orders.FindAsync(new object[] { request.OrderId }, cancellationToken)
                        ?? throw new NotFoundException(nameof(Order), request.OrderId);

            if (_currentUserService.Role == "Seller")
            {
                if (!order.Items.Any(i => i.Product.SellerId == _currentUserService.UserId))
                    throw new UnauthorizedException("You can only update status for your own sold products.");
            }
            else if (_currentUserService.Role != "Admin")
                throw new UnauthorizedException();

            order.Status = request.Status;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}