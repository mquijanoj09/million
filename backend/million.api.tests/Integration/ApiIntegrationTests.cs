using NUnit.Framework;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http;
using System.Text.Json;
using million.api.Models;
using million.api.Services;
using Moq;

namespace million.api.tests.Integration
{
    [TestFixture]
    public class ApiIntegrationTests
    {
        private WebApplicationFactory<Program> _factory;
        private HttpClient _client;
        private Mock<IPropertyService> _mockPropertyService;
        private Mock<IOwnerService> _mockOwnerService;

        [SetUp]
        public void Setup()
        {
            _mockPropertyService = new Mock<IPropertyService>();
            _mockOwnerService = new Mock<IOwnerService>();

            _factory = new WebApplicationFactory<Program>()
                .WithWebHostBuilder(builder =>
                {
                    builder.ConfigureServices(services =>
                    {
                        // Remove the real services
                        var propertyServiceDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IPropertyService));
                        if (propertyServiceDescriptor != null)
                            services.Remove(propertyServiceDescriptor);

                        var ownerServiceDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IOwnerService));
                        if (ownerServiceDescriptor != null)
                            services.Remove(ownerServiceDescriptor);

                        // Add mocked services
                        services.AddSingleton(_mockPropertyService.Object);
                        services.AddSingleton(_mockOwnerService.Object);
                    });
                });

            _client = _factory.CreateClient();
        }

        [TearDown]
        public void TearDown()
        {
            _client.Dispose();
            _factory.Dispose();
        }

        [Test]
        public async Task GetProperties_ReturnsJsonResponse()
        {
            // Arrange
            var mockProperties = new List<Property>
            {
                new Property { NumericId = 1, Name = "Test Property", Address = "123 Test St", Price = 100000 }
            };
            
            _mockPropertyService.Setup(s => s.GetPropertiesAsync(It.IsAny<PropertyFilter>()))
                .ReturnsAsync(mockProperties);

            // Act
            var response = await _client.GetAsync("/api/properties");

            // Assert
            Assert.That(response.IsSuccessStatusCode, Is.True);
            Assert.That(response.Content.Headers.ContentType?.MediaType, Is.EqualTo("application/json"));

            var content = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<ApiResponse<List<Property>>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            
            Assert.That(apiResponse, Is.Not.Null);
            Assert.That(apiResponse.Success, Is.True);
            Assert.That(apiResponse.Data, Has.Count.EqualTo(1));
        }

        [Test]
        public async Task GetPropertyById_WithValidId_ReturnsProperty()
        {
            // Arrange
            var mockProperty = new Property { NumericId = 1, Name = "Test Property", Address = "123 Test St", Price = 100000 };
            
            _mockPropertyService.Setup(s => s.GetPropertyByIdAsync("1"))
                .ReturnsAsync(mockProperty);

            // Act
            var response = await _client.GetAsync("/api/properties/1");

            // Assert
            Assert.That(response.IsSuccessStatusCode, Is.True);

            var content = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<ApiResponse<Property>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            
            Assert.That(apiResponse, Is.Not.Null);
            Assert.That(apiResponse.Success, Is.True);
            Assert.That(apiResponse.Data.Name, Is.EqualTo("Test Property"));
        }

        [Test]
        public async Task GetPropertyById_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            _mockPropertyService.Setup(s => s.GetPropertyByIdAsync("999"))
                .ReturnsAsync((Property?)null);

            // Act
            var response = await _client.GetAsync("/api/properties/999");

            // Assert
            Assert.That(response.StatusCode, Is.EqualTo(System.Net.HttpStatusCode.NotFound));
        }

        [Test]
        public async Task GetProperties_WithQueryParameters_PassesCorrectFilters()
        {
            // Arrange
            var mockProperties = new List<Property>();
            _mockPropertyService.Setup(s => s.GetPropertiesAsync(It.IsAny<PropertyFilter>()))
                .ReturnsAsync(mockProperties);

            // Act
            var response = await _client.GetAsync("/api/properties?name=House&minPrice=100000&maxPrice=500000");

            // Assert
            Assert.That(response.IsSuccessStatusCode, Is.True);
            
            _mockPropertyService.Verify(s => s.GetPropertiesAsync(It.Is<PropertyFilter>(f => 
                f.Name == "House" && 
                f.MinPrice == 100000 && 
                f.MaxPrice == 500000)), Times.Once);
        }

        [Test]
        public async Task GetOwners_ReturnsJsonResponse()
        {
            // Arrange
            var mockOwners = new List<Owner>
            {
                new Owner { NumericId = 1, Name = "John Doe", Address = "123 Main St", Birthday = "1980-01-01" }
            };
            
            _mockOwnerService.Setup(s => s.GetAllOwnersAsync())
                .ReturnsAsync(mockOwners);

            // Act
            var response = await _client.GetAsync("/api/owners");

            // Assert
            Assert.That(response.IsSuccessStatusCode, Is.True);
            Assert.That(response.Content.Headers.ContentType?.MediaType, Is.EqualTo("application/json"));

            var content = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<ApiResponse<List<Owner>>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            
            Assert.That(apiResponse, Is.Not.Null);
            Assert.That(apiResponse.Success, Is.True);
            Assert.That(apiResponse.Data, Has.Count.EqualTo(1));
            Assert.That(apiResponse.Data[0].Name, Is.EqualTo("John Doe"));
        }

        [Test]
        public async Task GetPropertySummary_ReturnsJsonResponse()
        {
            // Arrange
            var mockSummary = new PropertySummary 
            { 
                TotalProperties = 10, 
                AveragePrice = 300000, 
                TotalValue = 3000000 
            };
            
            _mockPropertyService.Setup(s => s.GetPropertySummaryAsync())
                .ReturnsAsync(mockSummary);

            // Act
            var response = await _client.GetAsync("/api/properties/summary");

            // Assert
            Assert.That(response.IsSuccessStatusCode, Is.True);

            var content = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<ApiResponse<PropertySummary>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            
            Assert.That(apiResponse, Is.Not.Null);
            Assert.That(apiResponse.Success, Is.True);
            Assert.That(apiResponse.Data.TotalProperties, Is.EqualTo(10));
            Assert.That(apiResponse.Data.AveragePrice, Is.EqualTo(300000));
        }
    }
}
