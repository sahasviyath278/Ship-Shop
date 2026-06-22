using MediatR;

namespace ECommerce.Application.Features.Reviews.Commands.CreateReview
{
    public class CreateReviewCommand : IRequest<Guid>
    {
        public Guid ProductId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}