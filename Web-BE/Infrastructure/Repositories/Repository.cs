using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
	public class Repository<T> : IRepository<T> where T : class
	{
		private readonly DbSet<T> _dbSet;
		private readonly DbContext _dbContext;

		public Repository(DbContext dbContext)
		{
			_dbContext = dbContext;
			_dbSet = _dbContext.Set<T>();
		}

		public async Task<List<T>> GetAllAsync(CancellationToken cancellationToken = default)
		{
			return await _dbSet.AsNoTracking().ToListAsync(cancellationToken);
		}

		public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
		{
			return await _dbSet.FindAsync([id], cancellationToken);
		}

		public async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
		{
			await _dbSet.AddAsync(entity, cancellationToken);
			await _dbContext.SaveChangesAsync(cancellationToken);
			return entity;
		}

		public async Task UpdateAsync(T entity, CancellationToken cancellationToken = default)
		{
			_dbSet.Update(entity);
			await _dbContext.SaveChangesAsync(cancellationToken);
		}

		public async Task DeleteAsync(T entity, CancellationToken cancellationToken = default)
		{
			_dbSet.Remove(entity);
			await _dbContext.SaveChangesAsync(cancellationToken);
		}

		public async Task<bool> ExistsAsync(System.Linq.Expressions.Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
		{
			return await _dbSet.AsNoTracking().AnyAsync(predicate, cancellationToken);
		}
	}
}


