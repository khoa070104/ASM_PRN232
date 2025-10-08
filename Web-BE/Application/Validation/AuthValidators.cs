using Application.DTOs;
using FluentValidation;

namespace Application.Validation
{
	public class UserRegisterValidator : AbstractValidator<UserRegisterDto>
	{
		public UserRegisterValidator()
		{
			RuleFor(x => x.Email)
				.NotEmpty().WithMessage("Email không được để trống")
				.EmailAddress().WithMessage("Email không hợp lệ")
				.MaximumLength(255).WithMessage("Email không được quá 255 ký tự");

			RuleFor(x => x.Password)
				.NotEmpty().WithMessage("Mật khẩu không được để trống")
				.MinimumLength(6).WithMessage("Mật khẩu phải có ít nhất 6 ký tự")
				.MaximumLength(100).WithMessage("Mật khẩu không được quá 100 ký tự");

			RuleFor(x => x.Role)
				.NotEmpty().WithMessage("Role không được để trống")
				.MaximumLength(50).WithMessage("Role không được quá 50 ký tự");
		}
	}

	public class UserLoginValidator : AbstractValidator<UserLoginDto>
	{
		public UserLoginValidator()
		{
			RuleFor(x => x.Email)
				.NotEmpty().WithMessage("Email không được để trống")
				.EmailAddress().WithMessage("Email không hợp lệ");

			RuleFor(x => x.Password)
				.NotEmpty().WithMessage("Mật khẩu không được để trống");
		}
	}
}
