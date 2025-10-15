using Domain.Entities;

namespace Application.Interfaces
{
	public interface IOrderRepository
	{
		Task<List<Order>> GetAllAsync(CancellationToken cancellationToken = default);
		Task<List<Order>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
		Task<Order?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
		Task<Order?> GetByUserIdAndIdAsync(Guid userId, Guid id, CancellationToken cancellationToken = default);
		Task<Order> AddAsync(Order entity, CancellationToken cancellationToken = default);
		Task UpdateAsync(Order entity, CancellationToken cancellationToken = default);
		Task DeleteAsync(Order entity, CancellationToken cancellationToken = default);
		Task<(IReadOnlyList<Order> Items, int Total)> GetByUserIdPagedAsync(Guid userId, int page, int pageSize, CancellationToken cancellationToken = default);
	}
}
