using million.api.Models;
using MongoDB.Driver;

namespace million.api.Services
{
    public interface IPropertyService
    {
        Task<(List<Property>, int)> GetPropertiesAsync(PropertyFilter? filter = null, PaginationParams? pagination = null);
        Task<Property?> GetPropertyByIdAsync(int id);
        Task<Property> CreatePropertyAsync(Property property);
        Task<Property?> UpdatePropertyAsync(int id, Property property);
        Task<bool> DeletePropertyAsync(int id);
        Task<PropertySummary> GetPropertySummaryAsync();
        Task<List<Property>> GetPropertiesByOwnerIdAsync(int ownerId);
        Task<int> GetNextNumericIdAsync();
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

        public async Task<(List<Property>, int)> GetPropertiesAsync(PropertyFilter? filter = null, PaginationParams? pagination = null)
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

            // Get total count
            var totalCount = await _properties.CountDocumentsAsync(filterBuilder);

            // Apply pagination
            var query = _properties.Find(filterBuilder);
            
            if (pagination != null)
            {
                var skip = (pagination.Page - 1) * pagination.PageSize;
                query = query.Skip(skip).Limit(pagination.PageSize);
            }

            var properties = await query.ToListAsync();

            // Load owner information for each property
            foreach (var property in properties)
            {
                property.Owner = await _ownerService.GetOwnerByIdAsync(property.IdOwner);
            }

            // Apply owner filter if specified (after loading owners)
            if (filter?.Owner != null)
            {
                properties = properties.Where(p => p.Owner?.Name.Contains(filter.Owner, StringComparison.OrdinalIgnoreCase) == true).ToList();
                totalCount = properties.Count;
            }

            return (properties, (int)totalCount);
        }

        public async Task<Property?> GetPropertyByIdAsync(int id)
        {
            var property = await _properties.Find(property => property.NumericId == id).FirstOrDefaultAsync();
            if (property != null)
            {
                property.Owner = await _ownerService.GetOwnerByIdAsync(property.IdOwner);
            }
            return property;
        }

        public async Task<Property> CreatePropertyAsync(Property property)
        {
            property.NumericId = await GetNextNumericIdAsync();
            property.CreatedAt = DateTime.UtcNow;
            property.UpdatedAt = DateTime.UtcNow;
            await _properties.InsertOneAsync(property);
            
            // Load owner information
            property.Owner = await _ownerService.GetOwnerByIdAsync(property.IdOwner);
            return property;
        }

        public async Task<Property?> UpdatePropertyAsync(int id, Property property)
        {
            property.UpdatedAt = DateTime.UtcNow;
            var filter = Builders<Property>.Filter.Eq(p => p.NumericId, id);
            var update = Builders<Property>.Update
                .Set(p => p.Name, property.Name)
                .Set(p => p.Address, property.Address)
                .Set(p => p.Price, property.Price)
                .Set(p => p.CodeInternal, property.CodeInternal)
                .Set(p => p.Year, property.Year)
                .Set(p => p.IdOwner, property.IdOwner)
                .Set(p => p.Photo, property.Photo)
                .Set(p => p.UpdatedAt, property.UpdatedAt);

            var result = await _properties.UpdateOneAsync(filter, update);
            return result.MatchedCount > 0 ? await GetPropertyByIdAsync(id) : null;
        }

        public async Task<bool> DeletePropertyAsync(int id)
        {
            var result = await _properties.DeleteOneAsync(property => property.NumericId == id);
            return result.DeletedCount > 0;
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

        public async Task<List<Property>> GetPropertiesByOwnerIdAsync(int ownerId)
        {
            var properties = await _properties.Find(property => property.IdOwner == ownerId).ToListAsync();
            
            // Load owner information for each property
            foreach (var property in properties)
            {
                property.Owner = await _ownerService.GetOwnerByIdAsync(property.IdOwner);
            }

            return properties;
        }

        public async Task<int> GetNextNumericIdAsync()
        {
            var lastProperty = await _properties.Find(property => true)
                .SortByDescending(property => property.NumericId)
                .Limit(1)
                .FirstOrDefaultAsync();

            return lastProperty?.NumericId + 1 ?? 1;
        }
    }
}
