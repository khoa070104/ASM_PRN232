using Domain.Entities;

namespace Application.Interfaces
{
	public interface IUserRepository
	{
		Task<List<User>> GetAllAsync(CancellationToken cancellationToken = default);
		Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
		Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
		Task<User> AddAsync(User entity, CancellationToken cancellationToken = default);
		Task UpdateAsync(User entity, CancellationToken cancellationToken = default);
		Task DeleteAsync(User entity, CancellationToken cancellationToken = default);
	}
}
