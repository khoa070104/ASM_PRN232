namespace Domain.Entities
{
	public class Product
	{
		public Guid Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public decimal Price { get; set; }
		public string? Image { get; set; }
		public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
		public DateTime? UpdatedAtUtc { get; set; }
	}
}


