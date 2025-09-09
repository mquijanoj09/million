using million.api.Models;
using million.api.Services;

namespace million.api.Services
{
    public class DataSeederService
    {
        private readonly IOwnerService _ownerService;
        private readonly IPropertyService _propertyService;

        public DataSeederService(IOwnerService ownerService, IPropertyService propertyService)
        {
            _ownerService = ownerService;
            _propertyService = propertyService;
        }

        public async Task SeedDataAsync()
        {
            // Check if data already exists
            var existingOwners = await _ownerService.GetAllOwnersAsync();
            if (existingOwners.Any())
            {
                return; // Data already seeded
            }

            // Seed Owners
            var owners = new List<Owner>
            {
                new Owner
                {
                    Name = "John Smith",
                    Address = "123 Main St, City",
                    Birthday = "1975-05-15",
                    Photo = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                },
                new Owner
                {
                    Name = "Sarah Johnson",
                    Address = "456 Oak Ave, Town",
                    Birthday = "1982-09-20",
                    Photo = "https://images.unsplash.com/photo-1494790108755-2616b169a57f?w=150&h=150&fit=crop&crop=face"
                },
                new Owner
                {
                    Name = "Michael Brown",
                    Address = "789 Pine Rd, Village",
                    Birthday = "1968-12-03",
                    Photo = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                },
                new Owner
                {
                    Name = "Emily Davis",
                    Address = "321 Elm St, District",
                    Birthday = "1990-07-18",
                    Photo = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                },
                new Owner
                {
                    Name = "Robert Wilson",
                    Address = "654 Cedar Ave, Suburb",
                    Birthday = "1980-03-25",
                    Photo = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
                }
            };

            var createdOwners = new List<Owner>();
            foreach (var owner in owners)
            {
                var createdOwner = await _ownerService.CreateOwnerAsync(owner);
                createdOwners.Add(createdOwner);
            }

            // Seed Properties
            var properties = new List<Property>
            {
                new Property
                {
                    Name = "Luxury Downtown Condo",
                    Address = "500 5th Avenue, New York, NY",
                    Price = 1250000,
                    CodeInternal = "NYC001",
                    Year = 2020,
                    IdOwner = createdOwners[0].NumericId,
                    Photo = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"
                },
                new Property
                {
                    Name = "Modern Family Home",
                    Address = "1234 Residential Dr, Austin, TX",
                    Price = 485000,
                    CodeInternal = "AUS002",
                    Year = 2018,
                    IdOwner = createdOwners[1].NumericId,
                    Photo = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop"
                },
                new Property
                {
                    Name = "Beachfront Villa",
                    Address = "987 Ocean View Blvd, Miami, FL",
                    Price = 2850000,
                    CodeInternal = "MIA003",
                    Year = 2021,
                    IdOwner = createdOwners[0].NumericId,
                    Photo = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
                },
                new Property
                {
                    Name = "Urban Studio Apartment",
                    Address = "742 City Center St, San Francisco, CA",
                    Price = 695000,
                    CodeInternal = "SF004",
                    Year = 2019,
                    IdOwner = createdOwners[2].NumericId,
                    Photo = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
                },
                new Property
                {
                    Name = "Suburban Family House",
                    Address = "159 Maple Street, Denver, CO",
                    Price = 425000,
                    CodeInternal = "DEN005",
                    Year = 2016,
                    IdOwner = createdOwners[3].NumericId,
                    Photo = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop"
                },
                new Property
                {
                    Name = "Mountain Cabin Retreat",
                    Address = "321 Pine Forest Rd, Aspen, CO",
                    Price = 890000,
                    CodeInternal = "ASP006",
                    Year = 2017,
                    IdOwner = createdOwners[4].NumericId,
                    Photo = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"
                },
                new Property
                {
                    Name = "Historic Brownstone",
                    Address = "876 Heritage Lane, Boston, MA",
                    Price = 1150000,
                    CodeInternal = "BOS007",
                    Year = 1995,
                    IdOwner = createdOwners[1].NumericId,
                    Photo = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"
                },
                new Property
                {
                    Name = "Desert Modern Home",
                    Address = "555 Cactus Way, Phoenix, AZ",
                    Price = 625000,
                    CodeInternal = "PHX008",
                    Year = 2022,
                    IdOwner = createdOwners[2].NumericId,
                    Photo = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"
                },
                new Property
                {
                    Name = "Lakefront Property",
                    Address = "234 Lake Shore Dr, Chicago, IL",
                    Price = 1450000,
                    CodeInternal = "CHI009",
                    Year = 2020,
                    IdOwner = createdOwners[4].NumericId,
                    Photo = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop"
                },
                new Property
                {
                    Name = "Countryside Estate",
                    Address = "789 Rolling Hills Rd, Nashville, TN",
                    Price = 750000,
                    CodeInternal = "NAS010",
                    Year = 2019,
                    IdOwner = createdOwners[3].NumericId,
                    Photo = "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&h=300&fit=crop"
                }
            };

            foreach (var property in properties)
            {
                await _propertyService.CreatePropertyAsync(property);
            }
        }
    }
}
