using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
	public class ECommerceDbContext : DbContext
	{
		public ECommerceDbContext(DbContextOptions<ECommerceDbContext> options) : base(options)
		{
		}

		public DbSet<Product> Products => Set<Product>();
		public DbSet<User> Users => Set<User>();
		public DbSet<CartItem> CartItems => Set<CartItem>();
		public DbSet<Order> Orders => Set<Order>();
		public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			// Product configuration
			modelBuilder.Entity<Product>(entity =>
			{
				entity.HasKey(p => p.Id);
				entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
				entity.Property(p => p.Description).IsRequired().HasMaxLength(2000);
				entity.Property(p => p.Price).HasColumnType("numeric(18,2)").IsRequired();
				entity.Property(p => p.Image).HasMaxLength(1000);
				entity.Property(p => p.CreatedAtUtc).IsRequired();
			});

			// User configuration
			modelBuilder.Entity<User>(entity =>
			{
				entity.HasKey(u => u.Id);
				entity.Property(u => u.Email).IsRequired().HasMaxLength(255);
				entity.Property(u => u.PasswordHash).IsRequired().HasMaxLength(255);
				entity.Property(u => u.Role).IsRequired().HasMaxLength(50);
				entity.Property(u => u.CreatedAtUtc).IsRequired();
				entity.HasIndex(u => u.Email).IsUnique();
			});

			// CartItem configuration
			modelBuilder.Entity<CartItem>(entity =>
			{
				entity.HasKey(c => c.Id);
				entity.Property(c => c.Quantity).IsRequired();
				entity.Property(c => c.CreatedAtUtc).IsRequired();
				
				entity.HasOne(c => c.User)
					.WithMany()
					.HasForeignKey(c => c.UserId)
					.OnDelete(DeleteBehavior.Cascade);
				
				entity.HasOne(c => c.Product)
					.WithMany()
					.HasForeignKey(c => c.ProductId)
					.OnDelete(DeleteBehavior.Cascade);
				
				entity.HasIndex(c => new { c.UserId, c.ProductId }).IsUnique();
			});

			// Order configuration
			modelBuilder.Entity<Order>(entity =>
			{
				entity.HasKey(o => o.Id);
				entity.Property(o => o.TotalAmount).HasColumnType("numeric(18,2)").IsRequired();
				entity.Property(o => o.Status).IsRequired().HasMaxLength(50);
				entity.Property(o => o.CreatedAtUtc).IsRequired();
				
				entity.HasOne(o => o.User)
					.WithMany()
					.HasForeignKey(o => o.UserId)
					.OnDelete(DeleteBehavior.Cascade);
			});

			// OrderDetail configuration
			modelBuilder.Entity<OrderDetail>(entity =>
			{
				entity.HasKey(od => od.Id);
				entity.Property(od => od.Quantity).IsRequired();
				entity.Property(od => od.UnitPrice).HasColumnType("numeric(18,2)").IsRequired();
				entity.Property(od => od.CreatedAtUtc).IsRequired();
				
				entity.HasOne(od => od.Order)
					.WithMany(o => o.OrderDetails)
					.HasForeignKey(od => od.OrderId)
					.OnDelete(DeleteBehavior.Cascade);
				
				entity.HasOne(od => od.Product)
					.WithMany()
					.HasForeignKey(od => od.ProductId)
					.OnDelete(DeleteBehavior.Restrict);
			});
		}
	}
}


