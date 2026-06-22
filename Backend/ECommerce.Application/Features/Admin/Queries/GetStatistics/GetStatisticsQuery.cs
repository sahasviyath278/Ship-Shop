using MediatR;

namespace ECommerce.Application.Features.Admin.Queries.GetStatistics
{
    public class GetStatisticsQuery : IRequest<StatisticsDto> { }

    public class StatisticsDto
    {
        public int TotalUsers { get; set; }
        public int TotalProducts { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}