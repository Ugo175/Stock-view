# Stock-View

A comprehensive stock trading web application built with React, Spring Boot, and MongoDB. This application allows users to browse, buy, and sell stocks with real-time portfolio management.

## Features

- **User Authentication**: Secure user registration and login with JWT tokens
- **Stock Browsing**: View all available stocks with real-time price information
- **Stock Search**: Search stocks by symbol or company name
- **Trading**: Buy and sell stocks with real-time balance updates
- **Portfolio Management**: Track holdings, gains/losses, and transaction history
- **Responsive Design**: Mobile-friendly interface
- **Dockerized**: Easy deployment with Docker Compose

## Tech Stack

### Backend
- **Spring Boot 3.2.0** - Java web framework
- **Spring Security** - Authentication and authorization
- **Spring Data MongoDB** - Database integration
- **JWT** - Token-based authentication
- **Maven** - Dependency management

### Frontend
- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Modern CSS** - Responsive styling

### Database
- **MongoDB 7.0** - Document database

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Project Structure

```
Stock-view/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/stocktrading/
│   │   ├── controller/         # REST controllers
│   │   ├── model/             # Data models
│   │   ├── repository/        # Data repositories
│   │   ├── security/          # Security configuration
│   │   ├── dto/               # Data transfer objects
│   │   └── config/            # Configuration classes
│   ├── src/main/resources/
│   │   ├── application.yml    # Application configuration
│   │   └── init-mongo.js      # MongoDB initialization script
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── contexts/          # React contexts
│   │   └── App.js             # Main app component
│   ├── public/
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Java 17+ (for local development)
- Node.js 16+ (for local development)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Stock-view
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - MongoDB: localhost:27017

### Local Development Setup

#### Backend Setup
1. Navigate to the backend directory
   ```bash
   cd backend
   ```

2. Build the application
   ```bash
   mvn clean package
   ```

3. Run the application
   ```bash
   java -jar target/stock-trading-backend-1.0.0.jar
   ```

#### Frontend Setup
1. Navigate to the frontend directory
   ```bash
   cd frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

#### Database Setup
1. Install and run MongoDB locally
2. The application will automatically create the database and sample data

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Stocks
- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/{symbol}` - Get stock by symbol
- `GET /api/stocks/search?query={query}` - Search stocks
- `GET /api/stocks/sector/{sector}` - Get stocks by sector

### Trading
- `POST /api/trading/buy` - Buy stocks
- `POST /api/trading/sell` - Sell stocks

### Portfolio
- `GET /api/portfolio` - Get user portfolio
- `GET /api/portfolio/transactions` - Get transaction history
- `GET /api/portfolio/balance` - Get user balance

## Sample Data

The application comes with pre-loaded sample stocks:
- **AAPL** - Apple Inc.
- **GOOGL** - Alphabet Inc.
- **MSFT** - Microsoft Corporation
- **TSLA** - Tesla Inc.
- **AMZN** - Amazon.com Inc.

Each user starts with a $10,000 balance for trading.

## Configuration

### Backend Configuration
The backend can be configured via `application.yml`:
- Database connection settings
- JWT secret and expiration
- CORS settings
- Server port

### Frontend Configuration
Environment variables for the frontend:
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:8080/api)

## Docker Configuration

### Services
- **MongoDB**: Database server with persistent volume
- **Backend**: Spring Boot application
- **Frontend**: React application served by Node.js

### Volumes
- `mongodb_data`: Persistent MongoDB data storage

### Networks
- `stock-network`: Internal network for service communication

## Security

- JWT-based authentication
- Password encryption with BCrypt
- CORS configuration for cross-origin requests
- Protected routes for authenticated users only

## Development Notes

### Backend
- Uses Spring Boot 3.2.0 with Java 17
- MongoDB integration with Spring Data
- JWT token authentication
- RESTful API design
- Comprehensive error handling

### Frontend
- React 18 with modern hooks
- Context API for state management
- Responsive design with CSS Grid/Flexbox
- Protected routes with authentication
- Real-time balance updates

## Deployment

### Using Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# Remove volumes (reset database)
docker-compose down -v
```

### Manual Deployment
1. Deploy MongoDB instance
2. Build and deploy Spring Boot backend
3. Build and deploy React frontend
4. Configure environment variables

## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 3000, 8080, and 27017 are available
2. **Database connection**: Check MongoDB is running and accessible
3. **CORS issues**: Verify CORS configuration in backend
4. **Authentication**: Ensure JWT secret is properly configured

### Logs
```bash
# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.