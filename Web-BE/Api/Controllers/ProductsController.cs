using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class ProductsController : ControllerBase
	{
		private readonly IProductService _productService;

		public ProductsController(IProductService productService)
		{
			_productService = productService;
		}

		[HttpGet]
		public async Task<ActionResult<List<ProductReadDto>>> GetAll(CancellationToken ct)
		{
			var result = await _productService.GetAllAsync(ct);
			return Ok(result);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<ProductReadDto>> GetById(Guid id, CancellationToken ct)
		{
			var result = await _productService.GetByIdAsync(id, ct);
			return Ok(result);
		}

		[HttpPost]
		public async Task<ActionResult<ProductReadDto>> Create([FromBody] ProductCreateDto dto, CancellationToken ct)
		{
			var created = await _productService.CreateAsync(dto, ct);
			return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<ProductReadDto>> Update(Guid id, [FromBody] ProductUpdateDto dto, CancellationToken ct)
		{
			var updated = await _productService.UpdateAsync(id, dto, ct);
			return Ok(updated);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
		{
			await _productService.DeleteAsync(id, ct);
			return NoContent();
		}
	}
}


