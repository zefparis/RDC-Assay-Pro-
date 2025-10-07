# RDC Assay Pro Backend API

Professional mineral assay and certification platform backend for the Democratic Republic of Congo.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Sample Management**: Complete sample lifecycle tracking
- **Report Generation**: Automated report creation with QR codes and hash verification
- **File Upload**: Secure document management for samples
- **Dashboard Analytics**: Real-time statistics and insights
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation
- **Database**: PostgreSQL with Prisma ORM
- **Security**: Rate limiting, input validation, and comprehensive error handling

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- PostgreSQL 12 or higher
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rdc-assay-pro/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/rdc_assay_pro"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=5000
   ```

4. **Database setup**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   
   # Seed the database with sample data
   npm run seed
   ```

## 🚀 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

The API will be available at:
- **API**: http://localhost:5000
- **Documentation**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

## 📚 API Documentation

Interactive API documentation is available at `/api-docs` when the server is running.

### Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Test Credentials

After running the seed script, you can use these test accounts:

- **Admin**: `admin@rdcassay.africa` / `admin123`
- **Analyst**: `analyst@rdcassay.africa` / `analyst123`
- **Client**: `client@mining-corp.cd` / `client123`

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── server.ts        # Application entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding
├── uploads/             # File upload directory
└── logs/                # Application logs
```

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Samples
- `POST /api/v1/samples` - Create new sample
- `GET /api/v1/samples` - Search samples
- `GET /api/v1/samples/:id` - Get sample by ID
- `PUT /api/v1/samples/:id` - Update sample
- `DELETE /api/v1/samples/:id` - Cancel sample

### Reports
- `POST /api/v1/reports` - Create new report
- `GET /api/v1/reports` - Search reports
- `GET /api/v1/reports/:id` - Get report by ID
- `GET /api/v1/reports/verify/:code` - Verify report authenticity

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/dashboard/system` - Get system statistics (admin)

### File Upload
- `POST /api/v1/upload/single` - Upload single file
- `POST /api/v1/upload/multiple` - Upload multiple files
- `GET /api/v1/upload/files/:id` - Get file info
- `DELETE /api/v1/upload/files/:id` - Delete file

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Authentication and user management
- **Samples**: Sample tracking and management
- **Reports**: Analysis reports and certification
- **Timeline Events**: Sample status history
- **Sample Documents**: File attachments
- **Activities**: System activity logging

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive request validation using Joi
- **File Upload Security**: File type and size restrictions
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **CORS Configuration**: Configurable cross-origin resource sharing

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📊 Monitoring & Logging

- **Winston Logger**: Structured logging with multiple transports
- **Health Check Endpoint**: `/health` for monitoring
- **Error Tracking**: Comprehensive error handling and logging
- **Performance Metrics**: Request duration and system metrics

## 🚀 Deployment

### Docker (Recommended)

```bash
# Build Docker image
docker build -t rdc-assay-pro-backend .

# Run with Docker Compose
docker-compose up -d
```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL="your-production-db-url"
   export JWT_SECRET="your-production-jwt-secret"
   ```

3. **Run database migrations**
   ```bash
   npm run prisma:deploy
   ```

4. **Start the application**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@rdcassay.africa
- Documentation: http://localhost:5000/api-docs
- Issues: GitHub Issues

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

**Built with ❤️ for the mining industry of the Democratic Republic of Congo**
