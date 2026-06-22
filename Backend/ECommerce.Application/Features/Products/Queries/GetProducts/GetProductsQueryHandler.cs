using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.DTOs.Products;

namespace ECommerce.Application.Features.Products.Queries.GetProducts
{
    public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, PagedResult<ProductDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetProductsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PagedResult<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Seller)
                .Include(p => p.Reviews)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Search))
                query = query.Where(p => p.Name.Contains(request.Search) || p.Description.Contains(request.Search));
            if (request.CategoryId.HasValue)
                query = query.Where(p => p.CategoryId == request.CategoryId.Value);
            if (request.MinPrice.HasValue)
                query = query.Where(p => p.Price >= request.MinPrice.Value);
            if (request.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= request.MaxPrice.Value);

            query = request.SortBy?.ToLower() switch
            {
                "price_asc" => query.OrderBy(p => p.Price),
                "price_desc" => query.OrderByDescending(p => p.Price),
                "newest" => query.OrderByDescending(p => p.CreatedAt),
                _ => query.OrderBy(p => p.Name)
            };

            var totalCount = await query.CountAsync(cancellationToken);
            var items = await query.Skip((request.Page - 1) * request.PageSize)
                                   .Take(request.PageSize)
                                   .ToListAsync(cancellationToken);

            var dtos = _mapper.Map<List<ProductDto>>(items);
            return new PagedResult<ProductDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }
    }
}