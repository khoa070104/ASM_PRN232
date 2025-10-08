using Application.DTOs;

namespace Application.Interfaces
{
	public interface IOrderService
	{
		Task<OrderCreateResponseDto> CreateFromCartAsync(Guid userId, CancellationToken ct = default);
		Task<List<OrderReadDto>> GetMyOrdersAsync(Guid userId, CancellationToken ct = default);
		Task<OrderReadDto> GetByIdAsync(Guid userId, Guid orderId, CancellationToken ct = default);
	}
}


