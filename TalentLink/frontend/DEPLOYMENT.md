# Production Deployment Guide

## Environment Variables

The frontend application requires proper API URL configuration for production deployment.

### 1. Environment Files

- **`.env`** - Single environment file containing development configurations.

### 2. Setting Up Production

**No manual changes are needed for the API URL in `.env`.**

The application is now configured to automatically detect the production environment and switch to the correct API URL (`https://talentlink-7pqy.onrender.com/api`) when running in production mode.

1. **Build the production bundle**:
   ```bash
   npm run build
   ```

2. **Deploy the build folder** to your hosting service (Netlify, Vercel, etc.)

### 3. Common Issues

#### Network Error in Production
If you're seeing "Network error - please check your connection" in production:

1. **Check Backend Status** - Verify your backend is running and accessible at `https://talentlink-7pqy.onrender.com/api`
2. **CORS Configuration** - Ensure your backend allows requests from your frontend domain (Fixed in `backend/settings.py` to allow all origins temporarily).
3. **HTTPS/HTTP Mismatch** - Both frontend and backend should use HTTPS in production.

#### Email Issues
If emails are not working:
1. Ensure `EMAIL_HOST`, `EMAIL_HOST_USER`, and `EMAIL_HOST_PASSWORD` are set in your Render environment variables (or wherever the backend is hosted).
2. Use an App Password for Gmail.

### 4. Testing Production Locally

To test production build locally:

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Serve the build**:
   ```bash
   npx serve -s build
   ```

3. **Access at** `http://localhost:5000`
   (Note: When serving locally like this, it might still point to the production API if `NODE_ENV` is set to production during build. Check network tab to confirm).

