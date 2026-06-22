using AutoMapper;
using ECommerce.Application.DTOs.Products;
using ECommerce.Application.DTOs.Cart;
using ECommerce.Application.DTOs.Orders;
using ECommerce.Application.DTOs.Reviews;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ECommerce.Domain.Entities.User, ECommerce.Application.Features.Admin.Queries.GetUsers.UserDto>();
            
            CreateMap<Product, ProductDto>()
                .ForMember(d => d.CategoryName, opt => opt.MapFrom(s => s.Category.Name))
                .ForMember(d => d.SellerName, opt => opt.MapFrom(s => s.Seller.FullName))
                .ForMember(d => d.ImageUrls, opt => opt.MapFrom(s => s.ImageUrls.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()))
                .ForMember(d => d.AverageRating, opt => opt.MapFrom(s => s.Reviews.Any() ? s.Reviews.Average(r => r.Rating) : 0))
                .ForMember(d => d.ReviewCount, opt => opt.MapFrom(s => s.Reviews.Count));

            CreateMap<Cart, CartDto>();
            CreateMap<CartItem, CartItemDto>()
                .ForMember(d => d.ProductName, opt => opt.MapFrom(s => s.Product.Name))
                .ForMember(d => d.UnitPrice, opt => opt.MapFrom(s => s.Product.Price))
                .ForMember(d => d.ImageUrl, opt => opt.MapFrom(s => s.Product.ImageUrls.Split(',').FirstOrDefault()));

            CreateMap<Order, OrderDto>();
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ProductName, opt => opt.MapFrom(s => s.Product.Name));

            CreateMap<Review, ReviewDto>()
                .ForMember(d => d.UserName, opt => opt.MapFrom(s => s.User.FullName));
        }
    }
}