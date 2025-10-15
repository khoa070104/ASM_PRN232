using Application.DTOs;

namespace Application.Interfaces
{
	public interface ICartService
	{
		Task<List<CartItemReadDto>> GetMyCartAsync(Guid userId, CancellationToken ct = default);
		Task<List<CartItemReadDto>> AddAsync(Guid userId, CartAddRequestDto dto, CancellationToken ct = default);
		Task<List<CartItemReadDto>> UpdateAsync(Guid userId, Guid itemId, CartUpdateRequestDto dto, CancellationToken ct = default);
		Task<List<CartItemReadDto>> RemoveAsync(Guid userId, Guid itemId, CancellationToken ct = default);
	}
}


