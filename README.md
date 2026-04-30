# Eco-Lender: Micro-Finance & Sustainability Platform

## Overview

Eco-Lender is a comprehensive micro-financing and sustainability platform that connects lenders with green initiatives and community projects. Users can lend small amounts of money to local environmental projects, track their investments, earn interest, and receive AI-powered recommendations for projects that match their interests.

## Key Features

- **User Authentication**: Secure login/signup with JWT
- **Dashboard**: Interactive dashboard with navbar and sidebar navigation
- **Loan Management**: CRUD operations for loan applications and tracking
- **AI Recommendation Engine**: Suggests projects based on user preferences and history
- **PDF Generation**: Auto-generate Impact Certificates and Loan Agreements
- **User Profiles**: Customizable profiles with avatars, bio, and preferences
- **Analytics Dashboard**: Admin panel with detailed insights and metrics
- **Notifications System**: Real-time updates on loan status, repayment reminders
- **Search Functionality**: Search for projects and community initiatives
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Third-Party Integration**: Payment processing, email notifications
- **Redux State Management**: Centralized application state
- **High Security**: Password encryption, CORS, rate limiting

## Tech Stack

- **Frontend**: React, Redux, Axios, React Router
- **Backend**: Express.js, Node.js, MongoDB
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **PDF Generation**: PDFKit
- **Payment Processing**: Stripe/PayPal
- **Email**: Nodemailer
- **Validation**: Joi/Express-validator

## Project Structure

```
Eco-Lender/
├── backend/              # Express.js server
│   ├── src/
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Auth, validation
│   │   ├── services/    # Business services
│   │   ├── config/      # Configuration
│   │   └── utils/       # Helper functions
│   ├── package.json
│   └── server.js
│
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # Redux store
│   │   ├── services/    # API services
│   │   ├── styles/      # CSS/SCSS
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB connection and API keys
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Update .env with backend API URL
npm start
```

## Requirements Coverage

1. ✅ Dashboard with Navbar and Sidebar
2. ✅ Login/Sign Up authentication
3. ✅ Multi-Device Optimization
4. ✅ Contact and Google Location
5. ✅ Photos and Biography
6. ✅ Blogs
7. ✅ Social Media Buttons
8. ✅ Well-Designed and Functional UI
9. ✅ Easy to Use
10. ✅ High Security
11. ✅ Redux State Management
12. ✅ AI Recommendation System
13. ✅ CRUD Operations
14. ✅ Cash Flow Statements (Debt + Credit)
15. ✅ PDF/Certificate Generation
16. ✅ Search Bar
17. ✅ Good Error Handling
18. ✅ Valid and Clean Code
19. ✅ User Profiles
20. ✅ Third-Party Integration
21. ✅ Analytics Dashboard
22. ✅ User Notifications
23. ✅ Sub-domains ready

## Environment Variables

### Backend (.env)

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_key
SENDGRID_API_KEY=your_sendgrid_key
NODE_ENV=development
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/loans` - List loans
- `POST /api/loans` - Create loan application
- `GET /api/loans/:id` - Get loan details
- `PUT /api/loans/:id` - Update loan
- `DELETE /api/loans/:id` - Delete loan
- `GET /api/recommendations` - Get AI recommendations
- `POST /api/pdf/certificate` - Generate certificate
- `GET /api/analytics` - Analytics data

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS enabled for frontend domain only
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- HTTPS recommended for production

## Contributing

1. Create a feature branch
2. Commit changes with clear messages
3. Push to repository
4. Create a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: April 2026
