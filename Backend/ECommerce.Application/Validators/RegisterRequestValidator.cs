using FluentValidation;
using ECommerce.Application.DTOs.Auth;

namespace ECommerce.Application.Validators
{
    public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
    {
        public RegisterRequestValidator()
        {
            RuleFor(x => x.Email).EmailAddress().NotEmpty();
            RuleFor(x => x.Password).MinimumLength(6);
            RuleFor(x => x.FullName).NotEmpty();
            RuleFor(x => x.Role).Must(r => r == "Buyer" || r == "Seller").WithMessage("Role must be Buyer or Seller");
        }
    }
}