using Application.DTOs;

namespace Application.Interfaces
{
	public interface IOrderService
	{
		Task<OrderCreateResponseDto> CreateFromCartAsync(Guid userId, CancellationToken ct = default);
		Task<PagedOrders> GetMyOrdersPagedAsync(Guid userId, int page, int pageSize, CancellationToken ct = default);
		Task<OrderReadDto> GetByIdAsync(Guid userId, Guid orderId, CancellationToken ct = default);
		Task MarkPaidAsync(Guid userId, Guid orderId, CancellationToken ct = default);
		Task MarkFailedAsync(Guid userId, Guid orderId, CancellationToken ct = default);
	}
}


