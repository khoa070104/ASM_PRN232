namespace Application.DTOs
{
	public record ProductCreateDto(string Name, string Description, decimal Price, string? Image);
	public record ProductUpdateDto(string Name, string Description, decimal Price, string? Image);
	public record ProductReadDto(Guid Id, string Name, string Description, decimal Price, string? Image, DateTime CreatedAtUtc, DateTime? UpdatedAtUtc);
	public record PagedResult<T>(IReadOnlyList<T> Items, int Total, int Page, int PageSize);
}


