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

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Product>(entity =>
			{
				entity.HasKey(p => p.Id);
				entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
				entity.Property(p => p.Description).IsRequired().HasMaxLength(2000);
				entity.Property(p => p.Price).HasColumnType("numeric(18,2)").IsRequired();
				entity.Property(p => p.Image).HasMaxLength(1000);
				entity.Property(p => p.CreatedAtUtc).IsRequired();
			});
		}
	}
}


