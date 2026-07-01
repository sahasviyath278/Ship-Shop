using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Features.Auth.Commands.Register;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Enums;
using ECommerce.Infrastructure.Data;       // for AppDbContext
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using FluentAssertions;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECommerce.Application.Tests
{
    public class RegisterCommandHandlerTests
    {
        private static AppDbContext CreateInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        [Fact]
        public async Task Handle_ValidBuyerRegistration_CreatesUserAndReturnsTokens()
        {
            // Arrange
            var dbContext = CreateInMemoryContext();
            var tokenServiceMock = new Mock<ITokenService>();
            tokenServiceMock.Setup(t => t.GenerateAccessToken(It.IsAny<User>())).Returns("fake-access-token");
            tokenServiceMock.Setup(t => t.GenerateRefreshToken()).Returns("fake-refresh-token");

            var handler = new RegisterCommandHandler(dbContext, tokenServiceMock.Object);
            var command = new RegisterCommand
            {
                Email = "buyer@test.com",
                Password = "Test@123",
                FullName = "Test Buyer",
                Role = "Buyer"
            };

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Email.Should().Be("buyer@test.com");
            result.Role.Should().Be("Buyer");
            result.AccessToken.Should().Be("fake-access-token");
            result.RefreshToken.Should().Be("fake-refresh-token");

            // Verify user was saved
            var savedUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == "buyer@test.com");
            savedUser.Should().NotBeNull();
            savedUser!.Role.Should().Be(UserRole.Buyer);
            savedUser.IsActive.Should().BeTrue();

            // Verify refresh token was stored
            var storedToken = await dbContext.RefreshTokens.FirstOrDefaultAsync(rt => rt.UserId == savedUser.Id);
            storedToken.Should().NotBeNull();
            storedToken!.Token.Should().Be("fake-refresh-token");
        }

        [Fact]
        public async Task Handle_DuplicateEmail_ThrowsValidationException()
        {
            // Arrange
            var dbContext = CreateInMemoryContext();
            var tokenServiceMock = new Mock<ITokenService>();
            var handler = new RegisterCommandHandler(dbContext, tokenServiceMock.Object);

            // Pre-create a user
            var existingUser = new User
            {
                Email = "duplicate@test.com",
                PasswordHash = "hash",
                FullName = "Existing",
                Role = UserRole.Buyer
            };
            dbContext.Users.Add(existingUser);
            await dbContext.SaveChangesAsync();

            var command = new RegisterCommand
            {
                Email = "duplicate@test.com",
                Password = "Test@123",
                FullName = "Duplicate",
                Role = "Buyer"
            };

            // Act
            Func<Task> act = async () => await handler.Handle(command, CancellationToken.None);

            // Assert
            await act.Should().ThrowAsync<ECommerce.Application.Exceptions.ValidationException>()
                .WithMessage("Email already registered.");
        }
    }
}