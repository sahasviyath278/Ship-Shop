using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerce.Application.DTOs.Reviews;
using ECommerce.Application.Features.Reviews.Commands.CreateReview;

namespace ECommerce.API.Controllers
{
    [ApiController, Route("api/[controller]")]
    [Authorize(Roles = "Buyer")]
    public class ReviewsController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ReviewsController(IMediator mediator) => _mediator = mediator;

        [HttpPost]
        public async Task<ActionResult<Guid>> Create(CreateReviewRequest request)
        {
            var id = await _mediator.Send(new CreateReviewCommand
            {
                ProductId = request.ProductId,
                Rating = request.Rating,
                Comment = request.Comment
            });
            return Ok(id);
        }
    }
}