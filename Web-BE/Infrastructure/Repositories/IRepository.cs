using System.Linq.Expressions;

namespace Infrastructure.Repositories
{
	public interface IRepository<T> where T : class
	{
		Task<List<T>> GetAllAsync(CancellationToken cancellationToken = default);
		Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
		Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
		Task UpdateAsync(T entity, CancellationToken cancellationToken = default);
		Task DeleteAsync(T entity, CancellationToken cancellationToken = default);
		Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);
	}
}


