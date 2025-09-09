using million.api.Models;
using MongoDB.Driver;

namespace million.api.Services
{
    public interface IOwnerService
    {
        Task<List<Owner>> GetAllOwnersAsync();
        Task<Owner?> GetOwnerByIdAsync(int id);
        Task<Owner> CreateOwnerAsync(Owner owner);
        Task<Owner?> UpdateOwnerAsync(int id, Owner owner);
        Task<bool> DeleteOwnerAsync(int id);
        Task<int> GetNextNumericIdAsync();
    }

    public class OwnerService : IOwnerService
    {
        private readonly IMongoCollection<Owner> _owners;

        public OwnerService(IMongoDatabase database)
        {
            _owners = database.GetCollection<Owner>("owners");
        }

        public async Task<List<Owner>> GetAllOwnersAsync()
        {
            return await _owners.Find(owner => true).ToListAsync();
        }

        public async Task<Owner?> GetOwnerByIdAsync(int id)
        {
            return await _owners.Find(owner => owner.NumericId == id).FirstOrDefaultAsync();
        }

        public async Task<Owner> CreateOwnerAsync(Owner owner)
        {
            owner.NumericId = await GetNextNumericIdAsync();
            owner.CreatedAt = DateTime.UtcNow;
            owner.UpdatedAt = DateTime.UtcNow;
            await _owners.InsertOneAsync(owner);
            return owner;
        }

        public async Task<Owner?> UpdateOwnerAsync(int id, Owner owner)
        {
            owner.UpdatedAt = DateTime.UtcNow;
            var filter = Builders<Owner>.Filter.Eq(o => o.NumericId, id);
            var update = Builders<Owner>.Update
                .Set(o => o.Name, owner.Name)
                .Set(o => o.Address, owner.Address)
                .Set(o => o.Photo, owner.Photo)
                .Set(o => o.Birthday, owner.Birthday)
                .Set(o => o.UpdatedAt, owner.UpdatedAt);

            var result = await _owners.UpdateOneAsync(filter, update);
            return result.MatchedCount > 0 ? await GetOwnerByIdAsync(id) : null;
        }

        public async Task<bool> DeleteOwnerAsync(int id)
        {
            var result = await _owners.DeleteOneAsync(owner => owner.NumericId == id);
            return result.DeletedCount > 0;
        }

        public async Task<int> GetNextNumericIdAsync()
        {
            var lastOwner = await _owners.Find(owner => true)
                .SortByDescending(owner => owner.NumericId)
                .Limit(1)
                .FirstOrDefaultAsync();

            return lastOwner?.NumericId + 1 ?? 1;
        }
    }
}
