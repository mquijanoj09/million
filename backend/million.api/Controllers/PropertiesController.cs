using Microsoft.AspNetCore.Mvc;
using million.api.Models;
using million.api.Services;

namespace million.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;

        public PropertiesController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Property>>>> GetProperties(
            [FromQuery] string? name = null,
            [FromQuery] string? address = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] int? year = null,
            [FromQuery] string? owner = null)
        {
            try
            {
                var filter = new PropertyFilter
                {
                    Name = name,
                    Address = address,
                    MinPrice = minPrice,
                    MaxPrice = maxPrice,
                    Year = year,
                    Owner = owner
                };

                var properties = await _propertyService.GetPropertiesAsync(filter);
                return Ok(ApiResponse<List<Property>>.SuccessResponse(properties, "Properties retrieved successfully", properties.Count));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<Property>>.ErrorResponse($"Error retrieving properties: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Property>>> GetPropertyById(string id)
        {
            try
            {
                var property = await _propertyService.GetPropertyByIdAsync(id);
                if (property == null)
                {
                    return NotFound(ApiResponse<Property>.ErrorResponse("Property not found"));
                }

                return Ok(ApiResponse<Property>.SuccessResponse(property, "Property retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<Property>.ErrorResponse($"Error retrieving property: {ex.Message}"));
            }
        }

        [HttpGet("summary")]
        public async Task<ActionResult<ApiResponse<PropertySummary>>> GetPropertySummary()
        {
            try
            {
                var summary = await _propertyService.GetPropertySummaryAsync();
                return Ok(ApiResponse<PropertySummary>.SuccessResponse(summary, "Property summary retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<PropertySummary>.ErrorResponse($"Error retrieving property summary: {ex.Message}"));
            }
        }
    }
}
