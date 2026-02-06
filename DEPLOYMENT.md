# Deployment Guide

This guide explains how to deploy the Kobo Excel Report application to your server.

## Prerequisites

- A server with Ubuntu/Debian (tested on Ubuntu)
- SSH access to the server
- Git repository with your code
- `sshpass` installed on your local machine (will be installed automatically if missing on macOS)

## Setup

### 1. Configure Deployment Credentials

Copy `deploy.env` file and update it with your information:

```bash
# Server Credentials
SERVER_HOST=159.223.43.248
SERVER_USER=root
SERVER_PASSWORD=your_server_password

# GitHub Configuration
GITHUB_TOKEN=your_github_token
GITHUB_REPO=https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Deployment Configuration
DEPLOY_PATH=/opt/kobo-excel
APP_NAME=kobo-excel
PORT=3000
```

**Important:** 
- `deploy.env` is gitignored and should never be committed
- Update `GITHUB_REPO` with your actual repository URL
- If using a public repository, you can leave `GITHUB_TOKEN` empty

### 2. Prepare Your Application .env

Ensure your local `.env` file contains all necessary configuration:

```bash
# Kobo API Configuration
KOBO_API_URL=https://kf.kobotoolbox.org/api/v2
KOBO_API_TOKEN=your_kobo_token

# Server Configuration
PORT=3000
NODE_ENV=production

# Image Processing Configuration
MAX_IMAGE_SIZE_MB=10
IMAGE_TIMEOUT_MS=5000
MAX_IMAGE_WIDTH_PX=800
MAX_IMAGE_HEIGHT_PX=600
```

This file will be automatically copied to the server during deployment.

## Deployment Commands

Make the deployment script executable (already done):
```bash
chmod +x deploy.sh
```

### Initialize (First Time Deployment)

Run this command for the first time deployment:

```bash
./deploy.sh initialize
```

This will:
- Install Node.js and PM2 on the server
- Configure PM2 to start on server boot
- Clone your repository to `/opt/kobo-excel`
- Copy your `.env` file to the server
- Install dependencies
- Start the application with PM2
- Save PM2 configuration

### Update Existing Deployment

When you have new code changes:

```bash
./deploy.sh update
```

This will:
- Pull the latest code from GitHub
- Update `.env` if changed
- Install/update dependencies
- Restart the application

### Other Commands

```bash
# Restart the application
./deploy.sh restart

# Start the application
./deploy.sh start

# Stop the application
./deploy.sh stop

# Check application status
./deploy.sh status

# View application logs
./deploy.sh logs
```

## Troubleshooting

### SSH Connection Issues

If you encounter SSH connection problems:
- Verify server IP, username, and password in `deploy.env`
- Ensure the server allows SSH connections
- Check if you need to add your IP to server firewall

### Port Already in Use

If port 3000 is already in use on the server:
- Update `PORT` in `deploy.env`
- Update `PORT` in your `.env` file
- Redeploy using `./deploy.sh update`

### PM2 Issues

View PM2 logs:
```bash
./deploy.sh logs
```

Check PM2 status:
```bash
./deploy.sh status
```

## Server Access

After deployment, your application will be available at:
```
http://159.223.43.248:3000
```

## Security Notes

- Never commit `deploy.env` or `.env` to git
- Both files are gitignored for security
- Keep your passwords and tokens secure
- Consider using SSH keys instead of password authentication
- Set up a reverse proxy (nginx/apache) for production
- Enable firewall and configure SSL/TLS certificates

## Manual Server Access

If you need to manually access the server:

```bash
ssh root@159.223.43.248
cd /opt/kobo-excel
pm2 list
pm2 logs kobo-excel
```
