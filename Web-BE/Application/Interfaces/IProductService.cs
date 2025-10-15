using Application.DTOs;

namespace Application.Interfaces
{
	public interface IProductService
	{
		Task<List<ProductReadDto>> GetAllAsync(CancellationToken cancellationToken = default);
		Task<PagedResult<ProductReadDto>> GetPagedAsync(int page, int pageSize, string? query, CancellationToken cancellationToken = default);
		Task<ProductReadDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
		Task<ProductReadDto> CreateAsync(ProductCreateDto dto, CancellationToken cancellationToken = default);
		Task<ProductReadDto> UpdateAsync(Guid id, ProductUpdateDto dto, CancellationToken cancellationToken = default);
		Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
	}
}


