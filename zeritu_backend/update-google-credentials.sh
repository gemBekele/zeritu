#!/bin/bash

# Script to help update Google OAuth credentials in .env file

echo "=========================================="
echo "Google OAuth Credentials Updater"
echo "=========================================="
echo ""
echo "This script will help you add Google OAuth credentials to your .env file."
echo ""
echo "First, make sure you have:"
echo "1. Created a Google Cloud Project"
echo "2. Enabled Google+ API"
echo "3. Configured OAuth Consent Screen"
echo "4. Created OAuth 2.0 Client ID credentials"
echo ""
echo "If you haven't done this yet, see GOOGLE_OAUTH_SETUP.md for detailed instructions."
echo ""
read -p "Press Enter to continue..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Creating .env file from setup-env.sh..."
    if [ -f setup-env.sh ]; then
        bash setup-env.sh
    else
        echo "Error: setup-env.sh not found. Please create .env manually."
        exit 1
    fi
fi

echo ""
echo "Please enter your Google OAuth credentials:"
echo ""

# Get Client ID
read -p "Enter your Google Client ID: " CLIENT_ID
if [ -z "$CLIENT_ID" ]; then
    echo "Error: Client ID cannot be empty!"
    exit 1
fi

# Get Client Secret
read -p "Enter your Google Client Secret: " CLIENT_SECRET
if [ -z "$CLIENT_SECRET" ]; then
    echo "Error: Client Secret cannot be empty!"
    exit 1
fi

echo ""
echo "Updating .env file..."

# Check if GOOGLE_CLIENT_ID already exists in .env
if grep -q "^GOOGLE_CLIENT_ID=" .env; then
    # Update existing line
    sed -i "s|^GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=\"$CLIENT_ID\"|" .env
else
    # Add new line (find the OAuth section and add after it)
    if grep -q "# OAuth" .env; then
        sed -i "/# OAuth/a GOOGLE_CLIENT_ID=\"$CLIENT_ID\"" .env
    else
        echo "GOOGLE_CLIENT_ID=\"$CLIENT_ID\"" >> .env
    fi
fi

# Check if GOOGLE_CLIENT_SECRET already exists in .env
if grep -q "^GOOGLE_CLIENT_SECRET=" .env; then
    # Update existing line
    sed -i "s|^GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=\"$CLIENT_SECRET\"|" .env
else
    # Add new line after GOOGLE_CLIENT_ID
    sed -i "/^GOOGLE_CLIENT_ID=/a GOOGLE_CLIENT_SECRET=\"$CLIENT_SECRET\"" .env
fi

echo ""
echo "✅ Credentials updated successfully!"
echo ""
echo "Your .env file now contains:"
echo "  GOOGLE_CLIENT_ID=\"$CLIENT_ID\""
echo "  GOOGLE_CLIENT_SECRET=\"$CLIENT_SECRET\""
echo ""
echo "⚠️  Important: Restart your backend server for changes to take effect:"
echo "   cd /home/barch/projects/zeritu_backend"
echo "   npm run dev"
echo ""







