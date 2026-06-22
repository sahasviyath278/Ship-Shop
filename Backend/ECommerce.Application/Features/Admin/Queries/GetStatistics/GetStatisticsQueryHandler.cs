using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;

namespace ECommerce.Application.Features.Admin.Queries.GetStatistics
{
    public class GetStatisticsQueryHandler : IRequestHandler<GetStatisticsQuery, StatisticsDto>
    {
        private readonly IApplicationDbContext _context;

        public GetStatisticsQueryHandler(IApplicationDbContext context) => _context = context;

        public async Task<StatisticsDto> Handle(GetStatisticsQuery request, CancellationToken cancellationToken)
        {
            return new StatisticsDto
            {
                TotalUsers = await _context.Users.CountAsync(cancellationToken),
                TotalProducts = await _context.Products.CountAsync(cancellationToken),
                TotalOrders = await _context.Orders.CountAsync(cancellationToken),
                TotalRevenue = await _context.Orders.SumAsync(o => o.TotalAmount, cancellationToken)
            };
        }
    }
}