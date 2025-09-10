using NUnit.Framework;
using Moq;
using Microsoft.AspNetCore.Mvc;
using million.api.Controllers;
using million.api.Services;
using million.api.Models;

namespace million.api.tests.Controllers
{
    [TestFixture]
    public class PropertiesControllerTests
    {
        private Mock<IPropertyService> _mockPropertyService;
        private PropertiesController _controller;

        [SetUp]
        public void Setup()
        {
            _mockPropertyService = new Mock<IPropertyService>();
            _controller = new PropertiesController(_mockPropertyService.Object);
        }

        [Test]
        public async Task GetProperties_ReturnsOkResult_WithProperties()
        {
            // Arrange
            var expectedProperties = new List<Property>
            {
                new Property { NumericId = 1, Name = "Test Property 1", Address = "123 Test St", Price = 100000 },
                new Property { NumericId = 2, Name = "Test Property 2", Address = "456 Test Ave", Price = 200000 }
            };
            
            _mockPropertyService.Setup(s => s.GetPropertiesAsync(It.IsAny<PropertyFilter>()))
                .ReturnsAsync(expectedProperties);

            // Act
            var result = await _controller.GetProperties();

            // Assert
            Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
            var okResult = result.Result as OkObjectResult;
            var response = okResult?.Value as ApiResponse<List<Property>>;
            
            Assert.That(response, Is.Not.Null);
            Assert.That(response.Success, Is.True);
            Assert.That(response.Data, Has.Count.EqualTo(2));
            Assert.That(response.Data[0].Name, Is.EqualTo("Test Property 1"));
        }

        [Test]
        public async Task GetProperties_WithFilters_PassesFiltersToService()
        {
            // Arrange
            var properties = new List<Property>();
            _mockPropertyService.Setup(s => s.GetPropertiesAsync(It.IsAny<PropertyFilter>()))
                .ReturnsAsync(properties);

            // Act
            await _controller.GetProperties(name: "Test", minPrice: 100000, maxPrice: 500000);

            // Assert
            _mockPropertyService.Verify(s => s.GetPropertiesAsync(It.Is<PropertyFilter>(f => 
                f.Name == "Test" && 
                f.MinPrice == 100000 && 
                f.MaxPrice == 500000)), Times.Once);
        }

        [Test]
        public async Task GetPropertyById_ReturnsOkResult_WhenPropertyExists()
        {
            // Arrange
            var expectedProperty = new Property { NumericId = 1, Name = "Test Property", Address = "123 Test St", Price = 100000 };
            _mockPropertyService.Setup(s => s.GetPropertyByIdAsync("1"))
                .ReturnsAsync(expectedProperty);

            // Act
            var result = await _controller.GetPropertyById("1");

            // Assert
            Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
            var okResult = result.Result as OkObjectResult;
            var response = okResult?.Value as ApiResponse<Property>;
            
            Assert.That(response, Is.Not.Null);
            Assert.That(response.Success, Is.True);
            Assert.That(response.Data.Name, Is.EqualTo("Test Property"));
        }

        [Test]
        public async Task GetPropertyById_ReturnsNotFound_WhenPropertyDoesNotExist()
        {
            // Arrange
            _mockPropertyService.Setup(s => s.GetPropertyByIdAsync("999"))
                .ReturnsAsync((Property?)null);

            // Act
            var result = await _controller.GetPropertyById("999");

            // Assert
            Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task GetProperties_ReturnsInternalServerError_WhenExceptionThrown()
        {
            // Arrange
            _mockPropertyService.Setup(s => s.GetPropertiesAsync(It.IsAny<PropertyFilter>()))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.GetProperties();

            // Assert
            Assert.That(result.Result, Is.InstanceOf<ObjectResult>());
            var errorResult = result.Result as ObjectResult;
            Assert.That(errorResult?.StatusCode, Is.EqualTo(500));
            
            var response = errorResult?.Value as ApiResponse<List<Property>>;
            Assert.That(response, Is.Not.Null);
            Assert.That(response.Success, Is.False);
            Assert.That(response.Message, Does.Contain("Database error"));
        }

        [Test]
        public async Task GetPropertySummary_ReturnsOkResult_WithSummary()
        {
            // Arrange
            var expectedSummary = new PropertySummary 
            { 
                TotalProperties = 5, 
                AveragePrice = 250000, 
                TotalValue = 1250000 
            };
            
            _mockPropertyService.Setup(s => s.GetPropertySummaryAsync())
                .ReturnsAsync(expectedSummary);

            // Act
            var result = await _controller.GetPropertySummary();

            // Assert
            Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
            var okResult = result.Result as OkObjectResult;
            var response = okResult?.Value as ApiResponse<PropertySummary>;
            
            Assert.That(response, Is.Not.Null);
            Assert.That(response.Success, Is.True);
            Assert.That(response.Data.TotalProperties, Is.EqualTo(5));
            Assert.That(response.Data.AveragePrice, Is.EqualTo(250000));
        }
    }
}
