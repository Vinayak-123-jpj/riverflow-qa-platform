# Appwrite Platform Setup Instructions

To fix CORS and authentication issues, you need to add your local development URL and production URL to your Appwrite project's platform settings.

## Steps:

1. Go to your Appwrite Console: https://cloud.appwrite.io
2. Select your project: `6a2febd70025fe23479e`
3. Navigate to **Settings** → **Platform**
4. Add the following platforms:

### For Local Development:
- **Platform Type**: Web
- **Hostname**: `localhost`
- **Port**: `3000` (or whatever port Next.js uses)

### For Production (Vercel):
- **Platform Type**: Web
- **Hostname**: Your Vercel domain (e.g., `your-project.vercel.app`)

## Important Notes:
- The platform settings control CORS and which domains can access your Appwrite project
- Without adding localhost, browser requests will be blocked by CORS
- Make sure to add both http://localhost:3000 and http://localhost:3001, 3002, etc. if you use multiple ports
