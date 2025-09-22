using Application.DTOs;
using FluentValidation;

namespace Application.Validation
{
	public class ProductCreateValidator : AbstractValidator<ProductCreateDto>
	{
		public ProductCreateValidator()
		{
			RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
			RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
			RuleFor(x => x.Price).GreaterThan(0);
			RuleFor(x => x.Image).MaximumLength(1000).When(x => !string.IsNullOrWhiteSpace(x.Image));
		}
	}

	public class ProductUpdateValidator : AbstractValidator<ProductUpdateDto>
	{
		public ProductUpdateValidator()
		{
			RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
			RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
			RuleFor(x => x.Price).GreaterThan(0);
			RuleFor(x => x.Image).MaximumLength(1000).When(x => !string.IsNullOrWhiteSpace(x.Image));
		}
	}
}


