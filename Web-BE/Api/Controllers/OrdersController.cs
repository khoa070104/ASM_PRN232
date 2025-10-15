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
	public class OrdersController : ControllerBase
	{
		private readonly IOrderService _orderService;

		public OrdersController(IOrderService orderService)
		{
			_orderService = orderService;
		}

		private Guid GetUserId()
		{
			var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub") ?? User.FindFirstValue("userId");
			return Guid.Parse(userIdStr!);
		}

		[HttpPost]
		public async Task<ActionResult<OrderCreateResponseDto>> Create(CancellationToken ct)
		{
			var result = await _orderService.CreateFromCartAsync(GetUserId(), ct);
			return Ok(result);
		}


		[HttpGet("me")]
		public async Task<ActionResult<PagedOrders>> MyOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
		{
			var result = await _orderService.GetMyOrdersPagedAsync(GetUserId(), page, pageSize, ct);
			return Ok(result);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<OrderReadDto>> GetById(Guid id, CancellationToken ct)
		{
			var result = await _orderService.GetByIdAsync(GetUserId(), id, ct);
			return Ok(result);
		}
	}
}


