using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace million.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly IMongoDatabase _database;

    public TestController(IMongoDatabase database)
    {
        _database = database;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            var collections = await _database.ListCollectionNames().ToListAsync();
            return Ok(new { message = "MongoDB connected!", collections });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Connection failed", error = ex.Message });
        }
    }
}

