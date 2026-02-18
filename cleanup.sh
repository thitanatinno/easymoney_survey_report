#!/bin/bash

# Server Cleanup Script - Remove Docker and Free Up Space

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Load deployment configuration
if [ ! -f "deploy.env" ]; then
    echo -e "${RED}Error: deploy.env file not found!${NC}"
    exit 1
fi

export $(cat deploy.env | grep -v '^#' | xargs)

# Function to execute remote commands
execute_remote() {
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "$1"
}

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo "======================================"
echo "   Server Cleanup & Docker Removal   "
echo "======================================"
echo ""

# Check current disk usage
print_info "Current disk usage:"
execute_remote "df -h /"
echo ""

# Stop all running Docker containers
print_info "Stopping all Docker containers..."
execute_remote "docker stop \$(docker ps -aq) 2>/dev/null || true"

# Remove all Docker containers
print_info "Removing all Docker containers..."
execute_remote "docker rm \$(docker ps -aq) 2>/dev/null || true"

# Remove all Docker images
print_info "Removing all Docker images..."
execute_remote "docker rmi \$(docker images -q) -f 2>/dev/null || true"

# Remove all Docker volumes
print_info "Removing all Docker volumes..."
execute_remote "docker volume rm \$(docker volume ls -q) 2>/dev/null || true"

# Clean Docker system
print_info "Cleaning Docker system (networks, build cache, etc.)..."
execute_remote "docker system prune -af --volumes 2>/dev/null || true"

# Stop Docker service
print_info "Stopping Docker service..."
execute_remote "systemctl stop docker 2>/dev/null || true"
execute_remote "systemctl stop docker.socket 2>/dev/null || true"

# Remove Docker
print_info "Removing Docker packages..."
execute_remote "apt-get purge -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin 2>/dev/null || true"
execute_remote "apt-get purge -y docker docker-engine docker.io containerd runc 2>/dev/null || true"

# Remove Docker directories
print_info "Removing Docker directories..."
execute_remote "rm -rf /var/lib/docker"
execute_remote "rm -rf /var/lib/containerd"
execute_remote "rm -rf /etc/docker"
execute_remote "rm -rf /var/run/docker.sock"

# Clean up package manager
print_info "Cleaning package manager cache..."
execute_remote "apt-get autoremove -y"
execute_remote "apt-get autoclean -y"
execute_remote "apt-get clean"

# Clean system logs
print_info "Cleaning old system logs..."
execute_remote "journalctl --vacuum-time=3d"
execute_remote "find /var/log -type f -name '*.log' -mtime +7 -delete 2>/dev/null || true"
execute_remote "find /var/log -type f -name '*.gz' -delete 2>/dev/null || true"

# Clean tmp directories
print_info "Cleaning temporary files..."
execute_remote "rm -rf /tmp/*"
execute_remote "rm -rf /var/tmp/*"

# Clean apt cache
print_info "Cleaning apt cache..."
execute_remote "rm -rf /var/cache/apt/archives/*.deb"

echo ""
print_info "Cleanup complete! New disk usage:"
execute_remote "df -h /"
echo ""

# Show what's using the most space
print_info "Top 10 largest directories:"
execute_remote "du -hsx /* 2>/dev/null | sort -rh | head -10"
echo ""

print_info "✅ Cleanup completed successfully!"
