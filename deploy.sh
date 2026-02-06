#!/bin/bash

# Kobo Excel Deployment Script
# Usage: ./deploy.sh [initialize|update|restart|start|stop|status]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load deployment configuration
if [ ! -f "deploy.env" ]; then
    echo -e "${RED}Error: deploy.env file not found!${NC}"
    echo "Please create deploy.env with server credentials"
    exit 1
fi

# Load environment variables
export $(cat deploy.env | grep -v '^#' | xargs)

# Verify required variables
if [ -z "$SERVER_HOST" ] || [ -z "$SERVER_USER" ] || [ -z "$SERVER_PASSWORD" ]; then
    echo -e "${RED}Error: Missing required server credentials in deploy.env${NC}"
    exit 1
fi

if [ -z "$GITHUB_REPO" ]; then
    echo -e "${RED}Error: GITHUB_REPO not set in deploy.env${NC}"
    echo "Please update deploy.env with your GitHub repository URL"
    exit 1
fi

# Default values
DEPLOY_PATH=${DEPLOY_PATH:-/opt/kobo-excel}
APP_NAME=${APP_NAME:-kobo-excel}
PORT=${PORT:-3000}

# Function to execute remote commands
execute_remote() {
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "$1"
}

# Function to copy files to server
copy_to_server() {
    sshpass -p "$SERVER_PASSWORD" scp -o StrictHostKeyChecking=no "$1" "$SERVER_USER@$SERVER_HOST:$2"
}

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to initialize deployment
initialize() {
    print_info "Starting initialization..."
    
    # Check if sshpass is installed
    if ! command -v sshpass &> /dev/null; then
        print_error "sshpass is not installed. Installing..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install hudochenkov/sshpass/sshpass
        else
            sudo apt-get install -y sshpass
        fi
    fi
    
    # Install PM2 on server if not available
    print_info "Checking PM2 installation on server..."
    execute_remote "command -v pm2 || (curl -sL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs && npm install -g pm2)"
    
    # Setup PM2 to run on startup
    print_info "Setting up PM2 to run on server startup..."
    execute_remote "pm2 startup systemd -u $SERVER_USER --hp /root || true"
    execute_remote "env PATH=\$PATH:/usr/bin pm2 startup systemd -u $SERVER_USER --hp /root || true"
    
    # Create deployment directory
    print_info "Creating deployment directory: $DEPLOY_PATH"
    execute_remote "mkdir -p $DEPLOY_PATH"
    
    # Clone repository with authentication
    print_info "Cloning repository..."
    if [ -n "$GITHUB_TOKEN" ]; then
        # Use token for private repos
        REPO_WITH_TOKEN=$(echo "$GITHUB_REPO" | sed "s|https://|https://${GITHUB_TOKEN}@|")
        execute_remote "cd $(dirname $DEPLOY_PATH) && rm -rf $(basename $DEPLOY_PATH) && git clone $REPO_WITH_TOKEN $(basename $DEPLOY_PATH)"
    else
        # Public repo
        execute_remote "cd $(dirname $DEPLOY_PATH) && rm -rf $(basename $DEPLOY_PATH) && git clone $GITHUB_REPO $(basename $DEPLOY_PATH)"
    fi
    
    # Copy .env file to server
    print_info "Copying .env file to server..."
    if [ -f ".env" ]; then
        copy_to_server ".env" "$DEPLOY_PATH/.env"
    else
        print_warning ".env file not found locally. You'll need to create it on the server."
    fi
    
    # Install dependencies
    print_info "Installing dependencies..."
    execute_remote "cd $DEPLOY_PATH && npm install --production"
    
    # Start application with PM2
    print_info "Starting application with PM2..."
    execute_remote "cd $DEPLOY_PATH && pm2 start src/app.js --name $APP_NAME --env production"
    
    # Save PM2 configuration
    print_info "Saving PM2 configuration..."
    execute_remote "pm2 save"
    
    print_info "Initialization complete!"
    status
}

# Function to update deployment
update() {
    print_info "Updating application..."
    
    # Pull latest changes
    print_info "Pulling latest changes from repository..."
    if [ -n "$GITHUB_TOKEN" ]; then
        REPO_WITH_TOKEN=$(echo "$GITHUB_REPO" | sed "s|https://|https://${GITHUB_TOKEN}@|")
        execute_remote "cd $DEPLOY_PATH && git remote set-url origin $REPO_WITH_TOKEN && git pull origin main || git pull origin master"
    else
        execute_remote "cd $DEPLOY_PATH && git pull origin main || git pull origin master"
    fi
    
    # Copy .env file to server (in case it changed)
    print_info "Updating .env file..."
    if [ -f ".env" ]; then
        copy_to_server ".env" "$DEPLOY_PATH/.env"
    fi
    
    # Install/update dependencies
    print_info "Installing/updating dependencies..."
    execute_remote "cd $DEPLOY_PATH && npm install --production"
    
    # Restart application
    print_info "Restarting application..."
    execute_remote "pm2 restart $APP_NAME"
    
    print_info "Update complete!"
    status
}

# Function to restart application
restart() {
    print_info "Restarting application..."
    execute_remote "pm2 restart $APP_NAME"
    print_info "Application restarted!"
    status
}

# Function to start application
start() {
    print_info "Starting application..."
    execute_remote "pm2 start $APP_NAME"
    print_info "Application started!"
    status
}

# Function to stop application
stop() {
    print_info "Stopping application..."
    execute_remote "pm2 stop $APP_NAME"
    print_info "Application stopped!"
}

# Function to show status
status() {
    print_info "Application status:"
    execute_remote "pm2 status $APP_NAME"
    echo ""
    print_info "Application logs (last 20 lines):"
    execute_remote "pm2 logs $APP_NAME --lines 20 --nostream || true"
}

# Function to show logs
logs() {
    print_info "Streaming application logs (Ctrl+C to exit)..."
    execute_remote "pm2 logs $APP_NAME"
}

# Function to show usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  initialize  - Initial deployment (install PM2, clone repo, setup)"
    echo "  update      - Update application (pull changes, update deps, restart)"
    echo "  restart     - Restart application"
    echo "  start       - Start application"
    echo "  stop        - Stop application"
    echo "  status      - Show application status"
    echo "  logs        - Stream application logs"
    echo ""
    echo "Example:"
    echo "  $0 initialize"
    echo "  $0 update"
}

# Main script
case "${1:-}" in
    initialize)
        initialize
        ;;
    update)
        update
        ;;
    restart)
        restart
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    logs)
        logs
        ;;
    *)
        usage
        exit 1
        ;;
esac
