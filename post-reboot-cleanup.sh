#!/bin/bash

# Post-Reboot Cleanup Script
# Run this after server reboots to remove old kernels

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

execute_remote() {
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "$1"
}

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo "======================================"
echo "    Post-Reboot Kernel Cleanup       "
echo "======================================"
echo ""

# Wait for server to be accessible
print_info "Waiting for server to come back online..."
for i in {1..30}; do
    if sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 "$SERVER_USER@$SERVER_HOST" "echo 'Server is up'" 2>/dev/null; then
        print_info "Server is accessible!"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 10
done

echo ""
print_info "Current kernel version:"
execute_remote "uname -r"

echo ""
print_info "Removing old kernel images..."
execute_remote "apt-get purge -y linux-image-6.8.0-58-generic linux-image-6.8.0-59-generic linux-headers-6.8.0-58-generic linux-headers-6.8.0-58 2>/dev/null || true"

print_info "Cleaning up old packages..."
execute_remote "apt-get autoremove -y"
execute_remote "apt-get autoclean -y"
execute_remote "apt-get clean"

echo ""
print_info "Final disk usage:"
execute_remote "df -h /"

echo ""
print_info "✅ Post-reboot cleanup completed!"
