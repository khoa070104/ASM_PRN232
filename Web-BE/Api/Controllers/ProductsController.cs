using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	[Authorize] // Require authentication for all endpoints
	public class ProductsController : ControllerBase
	{
		private readonly IProductService _productService;

		public ProductsController(IProductService productService)
		{
			_productService = productService;
		}


		[HttpGet]
		[AllowAnonymous]
		public async Task<ActionResult<PagedResult<ProductReadDto>>> GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 5, [FromQuery] string? q = null, CancellationToken ct = default)
		{
			var result = await _productService.GetPagedAsync(page, pageSize, q, ct);
			return Ok(result);
		}

		[HttpGet("{id}")]
		[AllowAnonymous] // Allow anonymous access for getting product by id
		public async Task<ActionResult<ProductReadDto>> GetById(Guid id, CancellationToken ct)
		{
			var result = await _productService.GetByIdAsync(id, ct);
			return Ok(result);
		}

		[HttpPost]
		[Authorize(Roles = "Admin")] // Only Admin can create products
		public async Task<ActionResult<ProductReadDto>> Create([FromBody] ProductCreateDto dto, CancellationToken ct)
		{
			var created = await _productService.CreateAsync(dto, ct);
			return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
		}

		[HttpPut("{id}")]
		[Authorize(Roles = "Admin")] // Only Admin can update products
		public async Task<ActionResult<ProductReadDto>> Update(Guid id, [FromBody] ProductUpdateDto dto, CancellationToken ct)
		{
			var updated = await _productService.UpdateAsync(id, dto, ct);
			return Ok(updated);
		}

		[HttpDelete("{id}")]
		[Authorize(Roles = "Admin")] // Only Admin can delete products
		public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
		{
			await _productService.DeleteAsync(id, ct);
			return NoContent();
		}
	}
}


