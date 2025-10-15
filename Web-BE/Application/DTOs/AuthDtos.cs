namespace Application.DTOs
{
	public record UserRegisterDto(string Email, string Password, string Role);
	public record UserLoginDto(string Email, string Password);
	public record AuthResponseDto(string UserId, string Email, string Role, string Token);
}
