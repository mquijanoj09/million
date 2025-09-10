using NUnit.Framework;
using million.api.Models;

namespace million.api.tests.Models
{
    [TestFixture]
    public class ApiResponseTests
    {
        [Test]
        public void SuccessResponse_CreatesValidResponse()
        {
            // Arrange
            var data = new List<string> { "item1", "item2" };
            var message = "Success";
            var total = 2;

            // Act
            var response = ApiResponse<List<string>>.SuccessResponse(data, message, total);

            // Assert
            Assert.That(response.Success, Is.True);
            Assert.That(response.Data, Is.EqualTo(data));
            Assert.That(response.Message, Is.EqualTo(message));
            Assert.That(response.Total, Is.EqualTo(total));
        }

        [Test]
        public void ErrorResponse_CreatesValidErrorResponse()
        {
            // Arrange
            var errorMessage = "Something went wrong";

            // Act
            var response = ApiResponse<string>.ErrorResponse(errorMessage);

            // Assert
            Assert.That(response.Success, Is.False);
            Assert.That(response.Data, Is.Null);
            Assert.That(response.Message, Is.EqualTo(errorMessage));
            Assert.That(response.Total, Is.Null);
        }
    }

    [TestFixture]
    public class PropertyFilterTests
    {
        [Test]
        public void PropertyFilter_CanBeCreated_WithAllProperties()
        {
            // Act
            var filter = new PropertyFilter
            {
                Name = "Test House",
                Address = "123 Main St",
                MinPrice = 100000,
                MaxPrice = 500000,
                Year = 2020,
                Owner = "John Doe"
            };

            // Assert
            Assert.That(filter.Name, Is.EqualTo("Test House"));
            Assert.That(filter.Address, Is.EqualTo("123 Main St"));
            Assert.That(filter.MinPrice, Is.EqualTo(100000));
            Assert.That(filter.MaxPrice, Is.EqualTo(500000));
            Assert.That(filter.Year, Is.EqualTo(2020));
            Assert.That(filter.Owner, Is.EqualTo("John Doe"));
        }

        [Test]
        public void PropertyFilter_CanBeCreated_WithNullValues()
        {
            // Act
            var filter = new PropertyFilter();

            // Assert
            Assert.That(filter.Name, Is.Null);
            Assert.That(filter.Address, Is.Null);
            Assert.That(filter.MinPrice, Is.Null);
            Assert.That(filter.MaxPrice, Is.Null);
            Assert.That(filter.Year, Is.Null);
            Assert.That(filter.Owner, Is.Null);
        }
    }

    [TestFixture]
    public class PropertySummaryTests
    {
        [Test]
        public void PropertySummary_CanCalculateAverageCorrectly()
        {
            // Arrange & Act
            var summary = new PropertySummary
            {
                TotalProperties = 4,
                TotalValue = 1000000
            };
            
            // Calculate average manually for test
            summary.AveragePrice = summary.TotalValue / summary.TotalProperties;

            // Assert
            Assert.That(summary.TotalProperties, Is.EqualTo(4));
            Assert.That(summary.TotalValue, Is.EqualTo(1000000));
            Assert.That(summary.AveragePrice, Is.EqualTo(250000));
        }
    }
}
