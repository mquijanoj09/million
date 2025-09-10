# Million Real Estate Project

A full-stack real estate management application built with Next.js frontend and .NET 8 Web API backend, using MongoDB for data storage.

## 🏗️ Project Structure

```
million/
├── frontend/           # Next.js 15 React application
│   ├── app/           # App router pages
│   ├── components/    # Reusable React components
│   ├── lib/          # Utilities and API client
│   ├── services/     # API service layer
│   └── types/        # TypeScript type definitions
├── backend/           # .NET 8 Web API
│   ├── million.api/          # Main API project
│   │   ├── Controllers/      # API controllers
│   │   ├── Models/          # Data models
│   │   ├── Services/        # Business logic layer
│   │   └── Classes/         # Configuration classes
│   └── million.api.tests/   # Unit and integration tests
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **.NET 8** SDK
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/mquijanoj09/million.git
cd million
```

### 2. MongoDB Setup

#### Option A: Local MongoDB Installation

1. **Install MongoDB Community Edition**

   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **Linux**: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB Service**

   ```bash
   # macOS/Linux
   brew services start mongodb-community
   # or
   mongod --config /usr/local/etc/mongod.conf

   # Windows
   net start MongoDB
   ```

3. **Create Database and Collections**

   ```bash
   mongosh
   use million_db

   # Create collections with sample data
   db.properties.insertMany([
     {
       "_id": ObjectId(),
       "NumericId": 1,
       "Name": "Luxury Downtown Condo",
       "Address": "123 Main Street, Downtown",
       "Price": 850000,
       "Year": 2020,
       "IdOwner": 1
     },
     {
       "_id": ObjectId(),
       "NumericId": 2,
       "Name": "Suburban Family Home",
       "Address": "456 Oak Avenue, Suburbs",
       "Price": 650000,
       "Year": 2018,
       "IdOwner": 2
     }
   ])

   db.owners.insertMany([
     {
       "_id": ObjectId(),
       "NumericId": 1,
       "Name": "John Smith",
       "Address": "789 Pine Street",
       "Birthday": "1980-05-15"
     },
     {
       "_id": ObjectId(),
       "NumericId": 2,
       "Name": "Sarah Johnson",
       "Address": "321 Elm Street",
       "Birthday": "1975-09-22"
     }
   ])
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and replace in `appsettings.json`

### 3. Backend Setup (.NET API)

```bash
cd backend

# Restore NuGet packages
dotnet restore

# Update connection string in appsettings.json
# Edit backend/million.api/appsettings.json:
{
  "MongoDBSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "million_db"
  }
}

# Build the project
dotnet build

# Run the API (will start on https://localhost:7135)
dotnet run --project million.api
```

**API will be available at:**

- HTTPS: `https://localhost:7135`
- HTTP: `http://localhost:5135`
- Swagger UI: `https://localhost:7135/swagger`

### 4. Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Update API base URL in lib/api.ts if needed
# Default points to: http://localhost:5135/api

# Start development server (will start on http://localhost:3000)
npm run dev
```

**Frontend will be available at:**

- `http://localhost:3000`

## 🧪 Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
dotnet test

# Run with detailed output
dotnet test --verbosity normal

# Run specific test project
dotnet test million.api.tests
```

**Test Coverage:**

- ✅ Controller tests (API endpoints)
- ✅ Model validation tests
- ✅ Integration tests (end-to-end API)
- **Total: 21 tests** - All passing

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

**Test Coverage:**

- ✅ Component tests (React components)
- ✅ Service tests (API client)
- ✅ Utility function tests
- **Total: 23 tests** - All passing

## 📚 API Documentation

### Base URL

- Development: `http://localhost:5135/api`
- Swagger Documentation: `https://localhost:7135/swagger`

### Endpoints

#### Properties

```http
GET    /api/properties           # Get all properties with optional filters
GET    /api/properties/{id}      # Get property by ID (supports ObjectId or numeric ID)
GET    /api/properties/summary   # Get properties summary statistics
```

**Query Parameters for GET /api/properties:**

- `name` (string): Filter by property name
- `address` (string): Filter by address
- `minPrice` (decimal): Minimum price filter
- `maxPrice` (decimal): Maximum price filter
- `year` (int): Filter by construction year
- `owner` (string): Filter by owner name

**Example Requests:**

```bash
# Get all properties
curl http://localhost:5135/api/properties

# Get properties with filters
curl "http://localhost:5135/api/properties?minPrice=500000&maxPrice=1000000&name=condo"

# Get specific property
curl http://localhost:5135/api/properties/1

# Get summary statistics
curl http://localhost:5135/api/properties/summary
```

#### Owners

```http
GET    /api/owners               # Get all owners
```

### Response Format

All API responses follow this structure:

```json
{
  "data": {}, // Response data
  "success": true, // Operation success status
  "message": "string", // Success/error message
  "total": 0 // Total count (when applicable)
}
```

## 🎨 Frontend Features

### Pages

- **Home (`/`)**: Properties dashboard with search and filters
- **Properties (`/properties`)**: Detailed properties listing
- **Property Details (`/properties/[id]`)**: Individual property information
- **Owners (`/owners`)**: Owners management

### Components

- **PropertyCard**: Individual property display
- **PropertyFilters**: Search and filter controls
- **PropertyList**: Properties grid layout
- **Header**: Navigation and title
- **Modal Components**: Contact owner, schedule viewing

### Services

- **Property Service**: Property-related API calls
- **Owner Service**: Owner-related API calls
- **API Client**: Centralized HTTP client with error handling

## 🔧 Configuration

### Backend Configuration (`appsettings.json`)

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "MongoDBSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "million_db"
  }
}
```

### Frontend Configuration

**Environment Variables** (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5135/api
```

**Next.js Configuration** (`next.config.ts`):

```typescript
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5135/api/:path*",
      },
    ];
  },
};
```

## 🚀 Deployment

### Backend Deployment

```bash
# Publish for production
dotnet publish -c Release -o publish

# Docker deployment (optional)
# Create Dockerfile in backend/million.api/
docker build -t million-api .
docker run -p 5000:5000 million-api
```

### Frontend Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
npx vercel --prod
```

## 🛠️ Development Tools

### Recommended VS Code Extensions

- **C#** - Microsoft
- **ES7+ React/Redux/React-Native snippets**
- **Prettier** - Code formatter
- **ESLint** - JavaScript linter
- **MongoDB for VS Code**

### Useful Commands

```bash
# Backend
dotnet watch run --project million.api    # Hot reload development
dotnet ef migrations add <name>           # Entity Framework migrations (if used)

# Frontend
npm run dev                               # Development with hot reload
npm run lint                             # ESLint check
npm run type-check                       # TypeScript check
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**

   - Ensure MongoDB is running: `brew services list | grep mongodb`
   - Check connection string in `appsettings.json`
   - Verify database name and credentials

2. **CORS Errors**

   - Backend CORS is configured for `http://localhost:3000`
   - Update CORS settings in `Program.cs` if using different ports

3. **Port Conflicts**

   - Backend default: 5135 (HTTP), 7135 (HTTPS)
   - Frontend default: 3000
   - Change ports in `launchSettings.json` (backend) or `package.json` (frontend)

4. **API Not Found (404)**

   - Verify backend is running on correct port
   - Check API base URL in frontend `lib/api.ts`
   - Ensure API endpoints match controller routes

5. **Test Failures**
   - Run `dotnet clean` and `dotnet build` for backend
   - Run `npm install` for frontend dependencies
   - Check MongoDB connection for integration tests

### Performance Tips

- Enable response compression in production
- Use MongoDB indexes for frequently queried fields
- Implement caching for static data
- Optimize bundle size with Next.js analyzer

## 📝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.
