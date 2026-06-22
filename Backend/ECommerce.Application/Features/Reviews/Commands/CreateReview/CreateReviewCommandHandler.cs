using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Application.Exceptions;

namespace ECommerce.Application.Features.Reviews.Commands.CreateReview
{
    public class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public CreateReviewCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<Guid> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            // Ensure buyer has purchased the product
            var hasPurchased = await _context.Orders
                .AnyAsync(o => o.UserId == userId && o.Items.Any(i => i.ProductId == request.ProductId));
            if (!hasPurchased)
                throw new ValidationException("You can only review products you have purchased.");

            var review = new Review
            {
                ProductId = request.ProductId,
                UserId = userId,
                Rating = request.Rating,
                Comment = request.Comment
            };
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync(cancellationToken);
            return review.Id;
        }
    }
}