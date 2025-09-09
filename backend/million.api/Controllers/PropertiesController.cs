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
        private readonly IOwnerService _ownerService;

        public PropertiesController(IPropertyService propertyService, IOwnerService ownerService)
        {
            _propertyService = propertyService;
            _ownerService = ownerService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Property>>>> GetProperties(
            [FromQuery] string? name = null,
            [FromQuery] string? address = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] int? year = null,
            [FromQuery] string? owner = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
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

                var pagination = new PaginationParams
                {
                    Page = page,
                    PageSize = pageSize
                };

                var (properties, totalCount) = await _propertyService.GetPropertiesAsync(filter, pagination);
                return Ok(ApiResponse<List<Property>>.SuccessResponse(properties, "Properties retrieved successfully", totalCount));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<Property>>.ErrorResponse($"Error retrieving properties: {ex.Message}"));
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<Property>>> GetPropertyById(int id)
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

        [HttpPost]
        public async Task<ActionResult<ApiResponse<Property>>> CreateProperty([FromBody] Property property)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<Property>.ErrorResponse("Invalid property data"));
                }

                // Validate that the owner exists
                var owner = await _ownerService.GetOwnerByIdAsync(property.IdOwner);
                if (owner == null)
                {
                    return BadRequest(ApiResponse<Property>.ErrorResponse("Owner not found"));
                }

                var createdProperty = await _propertyService.CreatePropertyAsync(property);
                return CreatedAtAction(nameof(GetPropertyById), new { id = createdProperty.NumericId },
                    ApiResponse<Property>.SuccessResponse(createdProperty, "Property created successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<Property>.ErrorResponse($"Error creating property: {ex.Message}"));
            }
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<Property>>> UpdateProperty(int id, [FromBody] Property property)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<Property>.ErrorResponse("Invalid property data"));
                }

                // Validate that the owner exists
                var owner = await _ownerService.GetOwnerByIdAsync(property.IdOwner);
                if (owner == null)
                {
                    return BadRequest(ApiResponse<Property>.ErrorResponse("Owner not found"));
                }

                var updatedProperty = await _propertyService.UpdatePropertyAsync(id, property);
                if (updatedProperty == null)
                {
                    return NotFound(ApiResponse<Property>.ErrorResponse("Property not found"));
                }

                return Ok(ApiResponse<Property>.SuccessResponse(updatedProperty, "Property updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<Property>.ErrorResponse($"Error updating property: {ex.Message}"));
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteProperty(int id)
        {
            try
            {
                var deleted = await _propertyService.DeletePropertyAsync(id);
                if (!deleted)
                {
                    return NotFound(ApiResponse<object>.ErrorResponse("Property not found"));
                }

                return Ok(ApiResponse<object>.SuccessResponse(new { }, "Property deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse($"Error deleting property: {ex.Message}"));
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

        [HttpPost("add-image/{id:int}")]
        public async Task<ActionResult<ApiResponse<Property>>> AddPropertyImage(int id, [FromBody] AddImageRequest request)
        {
            try
            {
                var property = await _propertyService.GetPropertyByIdAsync(id);
                if (property == null)
                {
                    return NotFound(ApiResponse<Property>.ErrorResponse("Property not found"));
                }

                property.Photo = request.ImageUrl;
                var updatedProperty = await _propertyService.UpdatePropertyAsync(id, property);
                
                return Ok(ApiResponse<Property>.SuccessResponse(updatedProperty!, "Property image updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<Property>.ErrorResponse($"Error updating property image: {ex.Message}"));
            }
        }
    }

    public class AddImageRequest
    {
        public string ImageUrl { get; set; } = string.Empty;
    }
}
