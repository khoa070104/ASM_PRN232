using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
	public class OrderRepository : IOrderRepository
	{
		private readonly ECommerceDbContext _dbContext;

		public OrderRepository(ECommerceDbContext dbContext)
		{
			_dbContext = dbContext;
		}

		public async Task<List<Order>> GetAllAsync(CancellationToken cancellationToken = default)
		{
			return await _dbContext.Orders
				.AsNoTracking()
				.Include(o => o.User)
				.Include(o => o.OrderDetails)
					.ThenInclude(od => od.Product)
				.OrderByDescending(x => x.CreatedAtUtc)
				.ToListAsync(cancellationToken);
		}

		public async Task<List<Order>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
		{
			return await _dbContext.Orders
				.AsNoTracking()
				.Include(o => o.User)
				.Include(o => o.OrderDetails)
					.ThenInclude(od => od.Product)
				.Where(o => o.UserId == userId)
				.OrderByDescending(x => x.CreatedAtUtc)
				.ToListAsync(cancellationToken);
		}

		public async Task<Order?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
		{
			return await _dbContext.Orders
				.AsNoTracking()
				.Include(o => o.User)
				.Include(o => o.OrderDetails)
					.ThenInclude(od => od.Product)
				.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
		}

		public async Task<Order> AddAsync(Order entity, CancellationToken cancellationToken = default)
		{
			await _dbContext.Orders.AddAsync(entity, cancellationToken);
			await _dbContext.SaveChangesAsync(cancellationToken);
			return entity;
		}

		public async Task UpdateAsync(Order entity, CancellationToken cancellationToken = default)
		{
			_dbContext.Orders.Update(entity);
			await _dbContext.SaveChangesAsync(cancellationToken);
		}

		public async Task DeleteAsync(Order entity, CancellationToken cancellationToken = default)
		{
			_dbContext.Orders.Remove(entity);
			await _dbContext.SaveChangesAsync(cancellationToken);
		}
	}
}
