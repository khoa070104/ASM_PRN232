using Domain.Entities;

namespace Application.Interfaces
{
	public interface ICartRepository
	{
		Task<List<CartItem>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
		Task<CartItem?> GetByUserAndProductAsync(Guid userId, Guid productId, CancellationToken cancellationToken = default);
		Task<CartItem> AddAsync(CartItem entity, CancellationToken cancellationToken = default);
		Task UpdateAsync(CartItem entity, CancellationToken cancellationToken = default);
		Task DeleteAsync(CartItem entity, CancellationToken cancellationToken = default);
		Task DeleteByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
	}
}
