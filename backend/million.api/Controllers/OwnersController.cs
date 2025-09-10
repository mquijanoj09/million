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

        public OwnersController(IOwnerService ownerService)
        {
            _ownerService = ownerService;
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
    }
}
