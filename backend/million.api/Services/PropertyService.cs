using million.api.Models;
using MongoDB.Driver;

namespace million.api.Services
{
    public interface IPropertyService
    {
        Task<List<Property>> GetPropertiesAsync(PropertyFilter? filter = null);
        Task<Property?> GetPropertyByIdAsync(string id);
        Task<PropertySummary> GetPropertySummaryAsync();
    }

    public class PropertyService : IPropertyService
    {
        private readonly IMongoCollection<Property> _properties;
        private readonly IOwnerService _ownerService;

        public PropertyService(IMongoDatabase database, IOwnerService ownerService)
        {
            _properties = database.GetCollection<Property>("properties");
            _ownerService = ownerService;
        }

        public async Task<List<Property>> GetPropertiesAsync(PropertyFilter? filter = null)
        {
            var filterBuilder = Builders<Property>.Filter.Empty;

            // Apply filters
            if (filter != null)
            {
                var filters = new List<FilterDefinition<Property>>();

                if (!string.IsNullOrEmpty(filter.Name))
                {
                    filters.Add(Builders<Property>.Filter.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(filter.Name, "i")));
                }

                if (!string.IsNullOrEmpty(filter.Address))
                {
                    filters.Add(Builders<Property>.Filter.Regex(p => p.Address, new MongoDB.Bson.BsonRegularExpression(filter.Address, "i")));
                }

                if (filter.MinPrice.HasValue)
                {
                    filters.Add(Builders<Property>.Filter.Gte(p => p.Price, filter.MinPrice.Value));
                }

                if (filter.MaxPrice.HasValue)
                {
                    filters.Add(Builders<Property>.Filter.Lte(p => p.Price, filter.MaxPrice.Value));
                }

                if (filter.Year.HasValue)
                {
                    filters.Add(Builders<Property>.Filter.Eq(p => p.Year, filter.Year.Value));
                }

                if (filters.Any())
                {
                    filterBuilder = Builders<Property>.Filter.And(filters);
                }
            }

            var properties = await _properties.Find(filterBuilder).ToListAsync();

            // Load owner information for each property
            foreach (var property in properties)
            {
                property.Owner = await _ownerService.GetOwnerByIdAsync(property.IdOwner);
            }

            // Apply owner filter if specified (after loading owners)
            if (filter?.Owner != null)
            {
                properties = properties.Where(p => p.Owner?.Name.Contains(filter.Owner, StringComparison.OrdinalIgnoreCase) == true).ToList();
            }

            return properties;
        }

        public async Task<Property?> GetPropertyByIdAsync(string id)
        {
            Property? property = null;
            
            // Try to find by MongoDB ObjectId first
            if (MongoDB.Bson.ObjectId.TryParse(id, out var objectId))
            {
                property = await _properties.Find(p => p.Id == id).FirstOrDefaultAsync();
            }
            
            // If not found and the id is numeric, try to find by NumericId
            if (property == null && int.TryParse(id, out var numericId))
            {
                property = await _properties.Find(p => p.NumericId == numericId).FirstOrDefaultAsync();
            }
            
            if (property != null)
            {
                property.Owner = await _ownerService.GetOwnerByIdAsync(property.IdOwner);
            }
            
            return property;
        }

        public async Task<PropertySummary> GetPropertySummaryAsync()
        {
            var properties = await _properties.Find(property => true).ToListAsync();
            
            return new PropertySummary
            {
                TotalProperties = properties.Count,
                TotalValue = properties.Sum(p => p.Price),
                AveragePrice = properties.Any() ? properties.Average(p => p.Price) : 0
            };
        }
    }
}
