namespace Domain.Entities
{
	public class CartItem
	{
		public Guid Id { get; set; }
		public Guid UserId { get; set; }
		public Guid ProductId { get; set; }
		public int Quantity { get; set; }
		public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
		public DateTime? UpdatedAtUtc { get; set; }

		// Navigation properties
		public User User { get; set; } = null!;
		public Product Product { get; set; } = null!;
	}
}
