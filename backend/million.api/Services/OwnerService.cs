using million.api.Models;
using MongoDB.Driver;

namespace million.api.Services
{
    public interface IOwnerService
    {
        Task<List<Owner>> GetAllOwnersAsync();
        Task<Owner?> GetOwnerByIdAsync(int id);
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
    }
}
