using Application.DTOs;
using Application.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private readonly IAuthService _authService;
		private readonly IValidator<UserRegisterDto> _registerValidator;
		private readonly IValidator<UserLoginDto> _loginValidator;

		public AuthController(IAuthService authService, IValidator<UserRegisterDto> registerValidator, IValidator<UserLoginDto> loginValidator)
		{
			_authService = authService;
			_registerValidator = registerValidator;
			_loginValidator = loginValidator;
		}

		[HttpPost("register")]
		public async Task<ActionResult<AuthResponseDto>> Register([FromBody] UserRegisterDto dto, CancellationToken ct)
		{
			var validationResult = await _registerValidator.ValidateAsync(dto, ct);
			if (!validationResult.IsValid)
			{
				return BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));
			}

			var result = await _authService.RegisterAsync(dto, ct);
			return Ok(result);
		}

		[HttpPost("login")]
		public async Task<ActionResult<AuthResponseDto>> Login([FromBody] UserLoginDto dto, CancellationToken ct)
		{
			var validationResult = await _loginValidator.ValidateAsync(dto, ct);
			if (!validationResult.IsValid)
			{
				return BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));
			}

			var result = await _authService.LoginAsync(dto, ct);
			return Ok(result);
		}
	}
}
