# Deployment Guide

## Backend Deployment

### Option 1: Deploy to Render

1. **Create account** at [render.com](https://render.com)
2. **Connect GitHub repository**
3. **Create new Web Service**:
   - Select repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables from `.env.example`
4. **Deploy**

### Option 2: Deploy to Railway

1. **Create account** at [railway.app](https://railway.app)
2. **Connect GitHub**
3. **Create new project**
4. **Select Node.js service**
5. **Add environment variables**:
   - `PORT=3001`
   - All variables from `.env.example`
6. **Deploy**

### Option 3: Deploy to Heroku

1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create app**: `heroku create app-name`
4. **Set environment variables**:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_secret
   ```
5. **Deploy**: `git push heroku main`

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Create account** at [vercel.com](https://vercel.com)
2. **Connect GitHub repository**
3. **Configure project**:
   - Framework: Create React App
   - Build command: `npm run build`
   - Output directory: `build`
4. **Add environment variables**:
   - `REACT_APP_API_URL`: Your backend API URL
5. **Deploy**

### Option 2: Deploy to Netlify

1. **Create account** at [netlify.com](https://netlify.com)
2. **Connect GitHub**
3. **Configure**:
   - Build command: `npm run build`
   - Publish directory: `build`
4. **Add environment variables**
5. **Deploy**

### Option 3: Deploy to AWS S3 + CloudFront

1. **Create S3 bucket**
2. **Build React app**: `npm run build`
3. **Upload to S3**
4. **Create CloudFront distribution**
5. **Set up custom domain**

## Database Deployment

### MongoDB Atlas (Recommended)

1. **Create account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create cluster**:
   - Choose free tier or paid tier
   - Select region
   - Configure security
3. **Get connection string**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/eco-lender?retryWrites=true&w=majority
   ```
4. **Add IP whitelist** for your deployed backend
5. **Use in `MONGODB_URI`**

## Environment Setup

### Backend `.env` for Production

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
PORT=3001
FRONTEND_URL=https://your-frontend-url.com
NODE_ENV=production

# Email Service
SENDGRID_API_KEY=your_sendgrid_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payment
STRIPE_SECRET_KEY=your_stripe_secret_key
PAYPAL_SECRET=your_paypal_secret

# File Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Maps
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Frontend `.env` for Production

```
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## SSL/TLS Certificates

### Using Let's Encrypt (Free)

```bash
# If using Nginx/Apache
sudo apt-get install certbot
sudo certbot certonly --standalone -d your-domain.com
```

### Using AWS Certificate Manager

1. Request certificate for your domain
2. Validate domain ownership
3. Apply to CloudFront/ALB

## Monitoring & Logging

### Backend Monitoring

- Use PM2 for process management
- Set up error tracking with Sentry
- Monitor with New Relic or Datadog

### Frontend Monitoring

- Set up Google Analytics
- Use Sentry for error tracking
- Monitor performance with Lighthouse CI

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: |
          cd backend
          npm install

      - name: Deploy to Render
        run: |
          curl https://api.render.com/deploy/srv-xxxxx?key=${{ secrets.RENDER_API_KEY }}
```

## Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set secure environment variables
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up DDoS protection
- [ ] Enable MongoDB authentication
- [ ] Use strong JWT secret
- [ ] Implement CSRF protection
- [ ] Add security headers
- [ ] Regular security audits

## Performance Optimization

### Backend

```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Enable caching
app.use(express.static('public', { maxAge: '1h' }));
```

### Frontend

```javascript
// Code splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// Image optimization
<img src={image} loading='lazy' />;
```

## Scaling Strategies

1. **Horizontal Scaling**: Add more instances behind load balancer
2. **Caching**: Implement Redis caching
3. **CDN**: Use CDN for static assets
4. **Database Optimization**: Add indexes, optimize queries
5. **Microservices**: Split into smaller services

## Backup & Disaster Recovery

### Database Backups

```bash
# MongoDB backup
mongodump --uri "mongodb+srv://..." --out ./backup

# AWS S3 backup
aws s3 cp ./backup s3://bucket-name/backup-$(date +%Y%m%d).tar.gz
```

### Restore

```bash
# Restore from backup
mongorestore --uri "mongodb+srv://..." ./backup
```

## Troubleshooting

### Backend not starting

```bash
# Check logs
heroku logs --tail

# Or for Render
# Check deployment logs in dashboard
```

### Frontend not loading

- Check if backend URL is correct
- Verify CORS settings
- Clear browser cache
- Check network tab in DevTools

### Database connection issues

- Verify connection string
- Check IP whitelist (MongoDB Atlas)
- Verify credentials
- Check firewall settings

---

For production deployment, always:

1. Test thoroughly in staging environment
2. Set up monitoring and alerts
3. Have rollback plan
4. Document deployment process
5. Regular backups

**Version**: 1.0.0
