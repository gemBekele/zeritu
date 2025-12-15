# Quick Start: Get Google OAuth Credentials

## Fast Track (5 minutes)

### 1. Go to Google Cloud Console
👉 **https://console.cloud.google.com/**

### 2. Create/Select Project
- Click project dropdown → "New Project" (or select existing)
- Name it "Zeritu" → Create

### 3. Enable API
- Left menu: **APIs & Services** → **Library**
- Search: "Google Identity" → Click → **Enable**

### 4. OAuth Consent Screen
- **APIs & Services** → **OAuth consent screen**
- Choose **External** → Create
- Fill in:
  - App name: `Zeritu Kebede`
  - Support email: (your email)
  - Developer email: (your email)
- Click **Save and Continue** through all steps

### 5. Create Credentials
- **APIs & Services** → **Credentials**
- **+ CREATE CREDENTIALS** → **OAuth client ID**
- Application type: **Web application**
- Name: `Zeritu Backend`

**Authorized JavaScript origins:**
```
http://localhost:3001
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:3001/api/auth/callback/google
```

- Click **Create**

### 6. Copy Credentials
You'll see a popup with:
- **Client ID** (copy this)
- **Client Secret** (copy this - you won't see it again!)

### 7. Add to .env File

Run this command:
```bash
cd /home/barch/projects/zeritu_backend
./update-google-credentials.sh
```

Or manually edit `.env`:
```env
GOOGLE_CLIENT_ID="paste-your-client-id-here"
GOOGLE_CLIENT_SECRET="paste-your-client-secret-here"
```

### 8. Restart Server
```bash
npm run dev
```

### 9. Test It!
1. Go to `http://localhost:3000/login`
2. Click "Sign in with Google"
3. Should redirect to Google login

## Need More Help?

See `GOOGLE_OAUTH_SETUP.md` for detailed instructions with screenshots.

## Common Issues

**"Redirect URI mismatch"**
- Check redirect URI is exactly: `http://localhost:3001/api/auth/callback/google`
- No trailing slash, use http (not https) for localhost

**"Access blocked"**
- Add your email as a test user in OAuth consent screen
- Go to: APIs & Services → OAuth consent screen → Test users → Add users







