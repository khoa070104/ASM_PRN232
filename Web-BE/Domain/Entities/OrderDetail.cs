namespace Domain.Entities
{
	public class OrderDetail
	{
		public Guid Id { get; set; }
		public Guid OrderId { get; set; }
		public Guid ProductId { get; set; }
		public int Quantity { get; set; }
		public decimal UnitPrice { get; set; }
		public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

		// Navigation properties
		public Order Order { get; set; } = null!;
		public Product Product { get; set; } = null!;
	}
}
