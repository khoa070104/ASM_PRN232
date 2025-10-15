using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace Application.Services
{
	public class AuthService : IAuthService
	{
		private readonly IUserRepository _userRepository;
		private readonly IConfiguration _configuration;

		public AuthService(IUserRepository userRepository, IConfiguration configuration)
		{
			_userRepository = userRepository;
			_configuration = configuration;
		}

		public async Task<AuthResponseDto> RegisterAsync(UserRegisterDto dto, CancellationToken cancellationToken = default)
		{
			// Check if user already exists
			var existingUser = await _userRepository.GetByEmailAsync(dto.Email, cancellationToken);
			if (existingUser != null)
			{
				throw new AppException("Email đã được sử dụng", 400, "EMAIL_EXISTS");
			}

			// Hash password
			var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

			// Create user
			var user = new User
			{
				Id = Guid.NewGuid(),
				Email = dto.Email,
				PasswordHash = passwordHash,
				Role = dto.Role,
				CreatedAtUtc = DateTime.UtcNow
			};

			await _userRepository.AddAsync(user, cancellationToken);

			// Generate JWT token
			var token = GenerateJwtToken(user);

			return new AuthResponseDto(user.Id.ToString(), user.Email, user.Role, token);
		}

		public async Task<AuthResponseDto> LoginAsync(UserLoginDto dto, CancellationToken cancellationToken = default)
		{
			// Find user by email
			var user = await _userRepository.GetByEmailAsync(dto.Email, cancellationToken);
			if (user == null)
			{
				throw new AppException("Email hoặc mật khẩu không đúng", 401, "INVALID_CREDENTIALS");
			}

			// Verify password
			if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
			{
				throw new AppException("Email hoặc mật khẩu không đúng", 401, "INVALID_CREDENTIALS");
			}

			// Generate JWT token
			var token = GenerateJwtToken(user);

			return new AuthResponseDto(user.Id.ToString(), user.Email, user.Role, token);
		}

		private string GenerateJwtToken(User user)
		{
			var jwtSettings = _configuration.GetSection("JwtSettings");
			var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
			var issuer = jwtSettings["Issuer"] ?? "ECommerceAPI";
			var audience = jwtSettings["Audience"] ?? "ECommerceClient";
			var expiryMinutes = int.Parse(jwtSettings["ExpiryMinutes"] ?? "60");

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
			var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var claims = new[]
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
				new Claim(ClaimTypes.Email, user.Email),
				new Claim(ClaimTypes.Role, user.Role),
				new Claim("userId", user.Id.ToString()),
				new Claim("role", user.Role)
			};

			var token = new JwtSecurityToken(
				issuer: issuer,
				audience: audience,
				claims: claims,
				expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
				signingCredentials: credentials
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}
