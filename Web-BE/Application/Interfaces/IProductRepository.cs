using Domain.Entities;

namespace Application.Interfaces
{
	public interface IProductRepository
	{
		Task<List<Product>> GetAllAsync(CancellationToken cancellationToken = default);
		Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
		Task<Product> AddAsync(Product entity, CancellationToken cancellationToken = default);
		Task UpdateAsync(Product entity, CancellationToken cancellationToken = default);
		Task DeleteAsync(Product entity, CancellationToken cancellationToken = default);
	}
}


