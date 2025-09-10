using NUnit.Framework;
using Moq;
using Microsoft.AspNetCore.Mvc;
using million.api.Controllers;
using million.api.Services;
using million.api.Models;

namespace million.api.tests.Controllers
{
    [TestFixture]
    public class OwnersControllerTests
    {
        private Mock<IOwnerService> _mockOwnerService;
        private OwnersController _controller;

        [SetUp]
        public void Setup()
        {
            _mockOwnerService = new Mock<IOwnerService>();
            _controller = new OwnersController(_mockOwnerService.Object);
        }

        [Test]
        public async Task GetAllOwners_ReturnsOkResult_WithOwners()
        {
            // Arrange
            var expectedOwners = new List<Owner>
            {
                new Owner { NumericId = 1, Name = "John Doe", Address = "123 Main St", Birthday = "1980-01-01" },
                new Owner { NumericId = 2, Name = "Jane Smith", Address = "456 Oak Ave", Birthday = "1985-05-15" }
            };
            
            _mockOwnerService.Setup(s => s.GetAllOwnersAsync())
                .ReturnsAsync(expectedOwners);

            // Act
            var result = await _controller.GetAllOwners();

            // Assert
            Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
            var okResult = result.Result as OkObjectResult;
            var response = okResult?.Value as ApiResponse<List<Owner>>;
            
            Assert.That(response, Is.Not.Null);
            Assert.That(response.Success, Is.True);
            Assert.That(response.Data, Has.Count.EqualTo(2));
            Assert.That(response.Data[0].Name, Is.EqualTo("John Doe"));
            Assert.That(response.Data[1].Name, Is.EqualTo("Jane Smith"));
        }

        [Test]
        public async Task GetAllOwners_ReturnsEmptyList_WhenNoOwnersExist()
        {
            // Arrange
            var emptyOwners = new List<Owner>();
            _mockOwnerService.Setup(s => s.GetAllOwnersAsync())
                .ReturnsAsync(emptyOwners);

            // Act
            var result = await _controller.GetAllOwners();

            // Assert
            Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
            var okResult = result.Result as OkObjectResult;
            var response = okResult?.Value as ApiResponse<List<Owner>>;
            
            Assert.That(response, Is.Not.Null);
            Assert.That(response.Success, Is.True);
            Assert.That(response.Data, Has.Count.EqualTo(0));
        }

        [Test]
        public async Task GetAllOwners_ReturnsInternalServerError_WhenExceptionThrown()
        {
            // Arrange
            _mockOwnerService.Setup(s => s.GetAllOwnersAsync())
                .ThrowsAsync(new Exception("Database connection failed"));

            // Act
            var result = await _controller.GetAllOwners();

            // Assert
            Assert.That(result.Result, Is.InstanceOf<ObjectResult>());
            var errorResult = result.Result as ObjectResult;
            Assert.That(errorResult?.StatusCode, Is.EqualTo(500));
            
            var response = errorResult?.Value as ApiResponse<List<Owner>>;
            Assert.That(response, Is.Not.Null);
            Assert.That(response.Success, Is.False);
            Assert.That(response.Message, Does.Contain("Database connection failed"));
        }

        [Test]
        public async Task GetAllOwners_CallsServiceOnce()
        {
            // Arrange
            var owners = new List<Owner>();
            _mockOwnerService.Setup(s => s.GetAllOwnersAsync())
                .ReturnsAsync(owners);

            // Act
            await _controller.GetAllOwners();

            // Assert
            _mockOwnerService.Verify(s => s.GetAllOwnersAsync(), Times.Once);
        }
    }
}
