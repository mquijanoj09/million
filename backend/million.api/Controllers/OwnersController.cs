using Microsoft.AspNetCore.Mvc;
using million.api.Models;
using million.api.Services;

namespace million.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OwnersController : ControllerBase
    {
        private readonly IOwnerService _ownerService;
        private readonly IPropertyService _propertyService;

        public OwnersController(IOwnerService ownerService, IPropertyService propertyService)
        {
            _ownerService = ownerService;
            _propertyService = propertyService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Owner>>>> GetAllOwners()
        {
            try
            {
                var owners = await _ownerService.GetAllOwnersAsync();
                return Ok(ApiResponse<List<Owner>>.SuccessResponse(owners, "Owners retrieved successfully", owners.Count));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<Owner>>.ErrorResponse($"Error retrieving owners: {ex.Message}"));
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<Owner>>> GetOwnerById(int id)
        {
            try
            {
                var owner = await _ownerService.GetOwnerByIdAsync(id);
                if (owner == null)
                {
                    return NotFound(ApiResponse<Owner>.ErrorResponse("Owner not found"));
                }

                return Ok(ApiResponse<Owner>.SuccessResponse(owner, "Owner retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<Owner>.ErrorResponse($"Error retrieving owner: {ex.Message}"));
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<Owner>>> CreateOwner([FromBody] Owner owner)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<Owner>.ErrorResponse("Invalid owner data"));
                }

                var createdOwner = await _ownerService.CreateOwnerAsync(owner);
                return CreatedAtAction(nameof(GetOwnerById), new { id = createdOwner.NumericId }, 
                    ApiResponse<Owner>.SuccessResponse(createdOwner, "Owner created successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<Owner>.ErrorResponse($"Error creating owner: {ex.Message}"));
            }
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<Owner>>> UpdateOwner(int id, [FromBody] Owner owner)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<Owner>.ErrorResponse("Invalid owner data"));
                }

                var updatedOwner = await _ownerService.UpdateOwnerAsync(id, owner);
                if (updatedOwner == null)
                {
                    return NotFound(ApiResponse<Owner>.ErrorResponse("Owner not found"));
                }

                return Ok(ApiResponse<Owner>.SuccessResponse(updatedOwner, "Owner updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<Owner>.ErrorResponse($"Error updating owner: {ex.Message}"));
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteOwner(int id)
        {
            try
            {
                // Check if owner has properties
                var properties = await _propertyService.GetPropertiesByOwnerIdAsync(id);
                if (properties.Any())
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse("Cannot delete owner with existing properties"));
                }

                var deleted = await _ownerService.DeleteOwnerAsync(id);
                if (!deleted)
                {
                    return NotFound(ApiResponse<object>.ErrorResponse("Owner not found"));
                }

                return Ok(ApiResponse<object>.SuccessResponse(new { }, "Owner deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse($"Error deleting owner: {ex.Message}"));
            }
        }

        [HttpGet("{id:int}/properties")]
        public async Task<ActionResult<ApiResponse<List<Property>>>> GetOwnerProperties(int id)
        {
            try
            {
                var owner = await _ownerService.GetOwnerByIdAsync(id);
                if (owner == null)
                {
                    return NotFound(ApiResponse<List<Property>>.ErrorResponse("Owner not found"));
                }

                var properties = await _propertyService.GetPropertiesByOwnerIdAsync(id);
                return Ok(ApiResponse<List<Property>>.SuccessResponse(properties, "Owner properties retrieved successfully", properties.Count));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<Property>>.ErrorResponse($"Error retrieving owner properties: {ex.Message}"));
            }
        }
    }
}
