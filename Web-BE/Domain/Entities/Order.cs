namespace Domain.Entities
{
	public class Order
	{
		public Guid Id { get; set; }
		public Guid UserId { get; set; }
		public decimal TotalAmount { get; set; }
		public string Status { get; set; } = "Pending"; // Pending, Processing, Shipped, Delivered, Cancelled
		public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
		public DateTime? UpdatedAtUtc { get; set; }

		// Navigation properties
		public User User { get; set; } = null!;
		public List<OrderDetail> OrderDetails { get; set; } = new();
	}
}
