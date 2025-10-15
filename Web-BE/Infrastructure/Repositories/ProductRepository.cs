using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
	public class ProductRepository : IProductRepository
	{
		private readonly ECommerceDbContext _dbContext;

		public ProductRepository(ECommerceDbContext dbContext)
		{
			_dbContext = dbContext;
		}

		public async Task<List<Product>> GetAllAsync(CancellationToken cancellationToken = default)
		{
			return await _dbContext.Products.AsNoTracking().OrderByDescending(x => x.CreatedAtUtc).ToListAsync(cancellationToken);
		}

		public async Task<(IReadOnlyList<Product> Items, int Total)> GetPagedAsync(int page, int pageSize, string? query, CancellationToken cancellationToken = default)
		{
			var q = _dbContext.Products.AsNoTracking();
			if (!string.IsNullOrWhiteSpace(query))
			{
				q = q.Where(x => x.Name.ToLower().Contains(query.ToLower()));
			}
			var total = await q.CountAsync(cancellationToken);
			var items = await q
				.OrderByDescending(x => x.CreatedAtUtc)
				.Skip((page - 1) * pageSize)
				.Take(pageSize)
				.ToListAsync(cancellationToken);
			return (items, total);
		}

		public async Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
		{
			return await _dbContext.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
		}

		public async Task<Product> AddAsync(Product entity, CancellationToken cancellationToken = default)
		{
			await _dbContext.Products.AddAsync(entity, cancellationToken);
			await _dbContext.SaveChangesAsync(cancellationToken);
			return entity;
		}

		public async Task UpdateAsync(Product entity, CancellationToken cancellationToken = default)
		{
			_dbContext.Products.Update(entity);
			await _dbContext.SaveChangesAsync(cancellationToken);
		}

		public async Task DeleteAsync(Product entity, CancellationToken cancellationToken = default)
		{
			_dbContext.Products.Remove(entity);
			await _dbContext.SaveChangesAsync(cancellationToken);
		}
	}
}


