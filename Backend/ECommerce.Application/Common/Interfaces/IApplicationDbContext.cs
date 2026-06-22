using Microsoft.EntityFrameworkCore;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; }
        DbSet<Product> Products { get; }
        DbSet<Category> Categories { get; }
        DbSet<Cart> Carts { get; }
        DbSet<CartItem> CartItems { get; }
        DbSet<Order> Orders { get; }
        DbSet<OrderItem> OrderItems { get; }
        DbSet<Review> Reviews { get; }
        DbSet<WishlistItem> WishlistItems { get; }
        DbSet<RefreshToken> RefreshTokens { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}