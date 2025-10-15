namespace Application.DTOs
{
	public record CartAddRequestDto(string ProductId, int Quantity);
	public record CartItemReadDto(string Id, string ProductId, string ProductName, string? ProductImage, decimal UnitPrice, int Quantity, decimal Subtotal);
	public record CartUpdateRequestDto(int Quantity);

	public record OrderCreateResponseDto(string OrderId, decimal TotalAmount);
	public record OrderDetailReadDto(string ProductId, string ProductName, int Quantity, decimal UnitPrice, decimal Subtotal);
	public record OrderReadDto(string Id, string UserId, decimal TotalAmount, string Status, DateTime CreatedAtUtc, List<OrderDetailReadDto> Details);
	public record PagedOrders(IReadOnlyList<OrderReadDto> Items, int Total, int Page, int PageSize);
}


