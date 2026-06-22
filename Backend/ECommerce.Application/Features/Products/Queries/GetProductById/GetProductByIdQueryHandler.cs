using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.DTOs.Products;
using ECommerce.Application.Exceptions;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Features.Products.Queries.GetProductById
{
    public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetProductByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Seller)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (product == null)
                throw new NotFoundException(nameof(Product), request.Id);

            return _mapper.Map<ProductDto>(product);
        }
    }
}