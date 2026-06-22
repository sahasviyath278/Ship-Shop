using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.DTOs.Orders;

namespace ECommerce.Application.Features.Orders.Queries.GetOrders
{
    public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, List<OrderDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;

        public GetOrdersQueryHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService)
        {
            _context = context;
            _mapper = mapper;
            _currentUserService = currentUserService;
        }

        public async Task<List<OrderDto>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Orders
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .AsQueryable();

            if (_currentUserService.Role == "Buyer")
                query = query.Where(o => o.UserId == _currentUserService.UserId);
            else if (_currentUserService.Role == "Seller")
                query = query.Where(o => o.Items.Any(i => i.Product.SellerId == _currentUserService.UserId));

            var orders = await query.OrderByDescending(o => o.OrderDate).ToListAsync(cancellationToken);
            return _mapper.Map<List<OrderDto>>(orders);
        }
    }
}