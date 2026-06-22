using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Data.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.Property(p => p.Price).HasColumnType("decimal(18,2)");
            builder.HasOne(p => p.Seller).WithMany(u => u.Products).HasForeignKey(p => p.SellerId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}