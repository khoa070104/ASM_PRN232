using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
	public class UserRepository : IUserRepository
	{
		private readonly ECommerceDbContext _dbContext;

		public UserRepository(ECommerceDbContext dbContext)
		{
			_dbContext = dbContext;
		}

		public async Task<List<User>> GetAllAsync(CancellationToken cancellationToken = default)
		{
			return await _dbContext.Users.AsNoTracking().OrderByDescending(x => x.CreatedAtUtc).ToListAsync(cancellationToken);
		}

		public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
		{
			return await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
		}

		public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
		{
			return await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
		}

		public async Task<User> AddAsync(User entity, CancellationToken cancellationToken = default)
		{
			await _dbContext.Users.AddAsync(entity, cancellationToken);
			await _dbContext.SaveChangesAsync(cancellationToken);
			return entity;
		}

		public async Task UpdateAsync(User entity, CancellationToken cancellationToken = default)
		{
			_dbContext.Users.Update(entity);
			await _dbContext.SaveChangesAsync(cancellationToken);
		}

		public async Task DeleteAsync(User entity, CancellationToken cancellationToken = default)
		{
			_dbContext.Users.Remove(entity);
			await _dbContext.SaveChangesAsync(cancellationToken);
		}
	}
}
