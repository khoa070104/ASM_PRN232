using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
	public class CartRepository : ICartRepository
	{
		private readonly ECommerceDbContext _dbContext;

		public CartRepository(ECommerceDbContext dbContext)
		{
			_dbContext = dbContext;
		}

		public async Task<List<CartItem>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
		{
			return await _dbContext.CartItems
				.AsNoTracking()
				.Include(c => c.Product)
				.Where(c => c.UserId == userId)
				.OrderByDescending(c => c.CreatedAtUtc)
				.ToListAsync(cancellationToken);
		}

		public async Task<CartItem?> GetByUserAndProductAsync(Guid userId, Guid productId, CancellationToken cancellationToken = default)
		{
			return await _dbContext.CartItems
				.AsNoTracking()
				.Include(c => c.Product)
				.FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId, cancellationToken);
		}

		public async Task<CartItem> AddAsync(CartItem entity, CancellationToken cancellationToken = default)
		{
			await _dbContext.CartItems.AddAsync(entity, cancellationToken);
			await _dbContext.SaveChangesAsync(cancellationToken);
			return entity;
		}

		public async Task UpdateAsync(CartItem entity, CancellationToken cancellationToken = default)
		{
			_dbContext.CartItems.Update(entity);
			await _dbContext.SaveChangesAsync(cancellationToken);
		}

		public async Task DeleteAsync(CartItem entity, CancellationToken cancellationToken = default)
		{
			_dbContext.CartItems.Remove(entity);
			await _dbContext.SaveChangesAsync(cancellationToken);
		}

		public async Task DeleteByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
		{
			var cartItems = await _dbContext.CartItems.Where(c => c.UserId == userId).ToListAsync(cancellationToken);
			_dbContext.CartItems.RemoveRange(cartItems);
			await _dbContext.SaveChangesAsync(cancellationToken);
		}
	}
}
