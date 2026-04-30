# Getting Started with Eco-Lender

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure secret key
- `STRIPE_SECRET_KEY`: Stripe API key (optional)
- `SENDGRID_API_KEY`: SendGrid API key (optional)

### 3. Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

- `REACT_APP_API_URL`: Backend server URL (default: http://localhost:5000)
- `REACT_APP_GOOGLE_MAPS_API_KEY`: Google Maps API key

### 3. Start Frontend Application

```bash
npm start
```

Application runs on `http://localhost:3000`

## Database Setup

### MongoDB Atlas (Recommended for Cloud)

1. Create account at [mongodb.com](https://www.mongodb.com)
2. Create a cluster
3. Get connection string
4. Add connection string to `.env`

### Local MongoDB

```bash
# Install MongoDB Community Edition
# Then start MongoDB service
mongod
```

Connection string: `mongodb://localhost:27017/eco-lender`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/stats` - Get user statistics

### Projects

- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `GET /api/projects/search/:query` - Search projects

### Loans

- `GET /api/loans` - Get user's loans
- `GET /api/loans/:id` - Get loan details
- `POST /api/loans` - Create loan
- `POST /api/loans/:id/payment` - Record payment

### Notifications

- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

### Recommendations

- `GET /api/recommendations` - Get recommendations
- `GET /api/recommendations/personalized` - Personalized recommendations

### Blogs

- `GET /api/blogs` - Get blog posts
- `GET /api/blogs/:id` - Get blog details
- `POST /api/blogs` - Create blog post

## Common Issues & Solutions

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm start
```

### MongoDB Connection Error

- Check connection string in `.env`
- Ensure MongoDB is running
- Check firewall settings for cloud databases

### CORS Error

- Verify `FRONTEND_URL` in backend `.env`
- Check that frontend is running on correct port

## Testing the Application

### Register a new user

1. Go to `http://localhost:3000/signup`
2. Fill in the registration form
3. Submit and login

### Create a project

1. Go to Dashboard
2. Click "New Project"
3. Fill in project details
4. Submit

### Explore projects

1. Go to Projects page
2. Browse available projects
3. View project details
4. Make an investment

## Development Tools

### Backend

- Nodemon for auto-reload
- Jest for testing
- ESLint for code quality

### Frontend

- React DevTools
- Redux DevTools
- Tailwind CSS IntelliSense

## Troubleshooting

### Clear node_modules and reinstall

```bash
rm -rf node_modules package-lock.json
npm install
```

### Clear cache

```bash
npm cache clean --force
```

### Check Node version

```bash
node --version  # Should be v14 or higher
```

## Next Steps

1. Configure email service (SendGrid or SMTP)
2. Set up payment processing (Stripe/PayPal)
3. Deploy backend to Render/Railway
4. Deploy frontend to Vercel
5. Set up CI/CD pipeline

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Support

For issues or questions:

1. Check the README.md
2. Review API documentation
3. Open an issue on GitHub

## Contributing

See CONTRIBUTING.md for guidelines

---

**Version**: 1.0.0
