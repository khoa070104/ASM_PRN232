using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	[Authorize]
	public class CartController : ControllerBase
	{
		private readonly ICartService _cartService;

		public CartController(ICartService cartService)
		{
			_cartService = cartService;
		}

		private Guid GetUserId()
		{
			var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub") ?? User.FindFirstValue("userId");
			return Guid.Parse(userIdStr!);
		}

		[HttpGet]
		public async Task<ActionResult<List<CartItemReadDto>>> Get(CancellationToken ct)
		{
			var result = await _cartService.GetMyCartAsync(GetUserId(), ct);
			return Ok(result);
		}

		[HttpPost("add")]
		public async Task<ActionResult<List<CartItemReadDto>>> Add([FromBody] CartAddRequestDto dto, CancellationToken ct)
		{
			var result = await _cartService.AddAsync(GetUserId(), dto, ct);
			return Ok(result);
		}

		[HttpPut("{itemId}")]
		public async Task<ActionResult<List<CartItemReadDto>>> Update(Guid itemId, [FromBody] CartUpdateRequestDto dto, CancellationToken ct)
		{
			var result = await _cartService.UpdateAsync(GetUserId(), itemId, dto, ct);
			return Ok(result);
		}

		[HttpDelete("{itemId}")]
		public async Task<ActionResult<List<CartItemReadDto>>> Delete(Guid itemId, CancellationToken ct)
		{
			var result = await _cartService.RemoveAsync(GetUserId(), itemId, ct);
			return Ok(result);
		}
	}
}


