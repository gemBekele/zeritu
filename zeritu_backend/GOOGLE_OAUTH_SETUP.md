# Google OAuth Setup Guide

This guide will help you obtain Google OAuth credentials for the Zeritu backend.

## Step-by-Step Instructions

### 1. Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### 2. Create a New Project (if you don't have one)
1. Click on the project dropdown at the top of the page (next to "Google Cloud")
2. Click "New Project"
3. Enter a project name (e.g., "Zeritu Website")
4. Click "Create"
5. Wait for the project to be created, then select it from the dropdown

### 3. Enable Google+ API / Google Identity API
1. In the left sidebar, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google+ API"** or **"Google Identity"**
3. Click on it and click **"Enable"**

### 4. Configure OAuth Consent Screen
1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: `Zeritu Kebede` (or your app name)
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click **"Save and Continue"**
6. On the "Scopes" page, click **"Save and Continue"** (default scopes are fine)
7. On the "Test users" page, click **"Save and Continue"** (you can add test users later)
8. Review and click **"Back to Dashboard"**

### 5. Create OAuth 2.0 Credentials
1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. Choose **"Web application"** as the application type
5. Give it a name: `Zeritu Backend` (or any name you prefer)
6. Configure **Authorized JavaScript origins**:
   - Click **"+ ADD URI"**
   - Add: `http://localhost:3001` (for development)
   - Add: `http://localhost:3000` (for frontend if needed)
   - For production, add your production URLs
7. Configure **Authorized redirect URIs**:
   - Click **"+ ADD URI"**
   - Add: `http://localhost:3001/api/auth/callback/google`
   - For production, add: `https://yourdomain.com/api/auth/callback/google`
8. Click **"Create"**

### 6. Copy Your Credentials
After clicking "Create", a dialog will appear showing:
- **Your Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
- **Your Client Secret** (looks like: `GOCSPX-abcdefghijklmnopqrstuvwxyz`)

**⚠️ IMPORTANT**: Copy these immediately! You won't be able to see the secret again.

### 7. Add Credentials to Backend .env File

Open `/home/barch/projects/zeritu_backend/.env` and update these lines:

```env
GOOGLE_CLIENT_ID="your-actual-client-id-here"
GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
```

Replace `your-actual-client-id-here` and `your-actual-client-secret-here` with the values you copied.

### 8. Restart Your Backend Server

After adding the credentials, restart your backend server:

```bash
cd /home/barch/projects/zeritu_backend
npm run dev
```

### 9. Test Google OAuth

1. Start your frontend: `cd /home/barch/projects/zeritu_web && npm run dev`
2. Navigate to `http://localhost:3000/login`
3. Click "Sign in with Google"
4. You should be redirected to Google's login page
5. After logging in, you'll be redirected back to your app

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the redirect URI in Google Cloud Console exactly matches: `http://localhost:3001/api/auth/callback/google`
- Check for trailing slashes or http vs https mismatches

### "Access blocked" error
- Make sure you've added your email as a test user in the OAuth consent screen
- For production, you'll need to publish your app (requires verification)

### Credentials not working
- Double-check that you copied the credentials correctly (no extra spaces)
- Make sure the backend server has been restarted after adding credentials
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in the `.env` file

## Production Considerations

1. **Update redirect URIs** for your production domain
2. **Publish your OAuth app** (requires verification for external users)
3. **Use environment variables** in production (never commit `.env` files)
4. **Consider using a secrets manager** for production deployments

## Quick Reference

- **OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent
- **Credentials Page**: https://console.cloud.google.com/apis/credentials
- **API Library**: https://console.cloud.google.com/apis/library







