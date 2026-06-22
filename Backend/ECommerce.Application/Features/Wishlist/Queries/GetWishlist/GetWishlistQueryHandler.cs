using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.DTOs.Products;

namespace ECommerce.Application.Features.Wishlist.Queries.GetWishlist
{
    public class GetWishlistQueryHandler : IRequestHandler<GetWishlistQuery, List<ProductDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;

        public GetWishlistQueryHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService)
        {
            _context = context;
            _mapper = mapper;
            _currentUserService = currentUserService;
        }

        public async Task<List<ProductDto>> Handle(GetWishlistQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            var products = await _context.WishlistItems
                .Where(w => w.UserId == userId)
                .Include(w => w.Product)
                .ThenInclude(p => p.Category)
                .Include(w => w.Product.Seller)
                .Select(w => w.Product)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<ProductDto>>(products);
        }
    }
}