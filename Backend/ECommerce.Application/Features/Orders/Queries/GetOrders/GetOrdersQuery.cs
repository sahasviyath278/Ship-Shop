using MediatR;
using ECommerce.Application.DTOs.Orders;

namespace ECommerce.Application.Features.Orders.Queries.GetOrders
{
    public class GetOrdersQuery : IRequest<List<OrderDto>> { }
}