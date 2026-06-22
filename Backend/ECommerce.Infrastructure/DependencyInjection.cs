using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Infrastructure.Data;
using ECommerce.Infrastructure.Services;

namespace ECommerce.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Register IHttpContextAccessor (needed by CurrentUserService)
            services.AddHttpContextAccessor();

            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<AppDbContext>());
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}