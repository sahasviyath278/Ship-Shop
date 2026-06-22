using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.DTOs.Cart;
using ECommerce.Application.Exceptions;

namespace ECommerce.Application.Features.Cart.Queries.GetCart
{
    public class GetCartQueryHandler : IRequestHandler<GetCartQuery, CartDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMapper _mapper;

        public GetCartQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService, IMapper mapper)
        {
            _context = context;
            _currentUserService = currentUserService;
            _mapper = mapper;
        }

        public async Task<CartDto> Handle(GetCartQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

            if (cart == null)
            {
                cart = new ECommerce.Domain.Entities.Cart { UserId = userId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync(cancellationToken);
            }

            return _mapper.Map<CartDto>(cart);
        }
    }
}