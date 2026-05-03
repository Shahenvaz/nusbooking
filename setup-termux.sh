#!/bin/bash

# Termux Setup Script for Bus Booking System
# This script installs dependencies, sets up the database, and prepares the application.

set -e

echo "--- Updating system packages ---"
pkg update -y && pkg upgrade -y

echo "--- Installing dependencies (Node.js, MariaDB, Git, Cloudflared) ---"
pkg install -y nodejs-lts mariadb git cloudflared

echo "--- Installing Global NPM Packages (PM2) ---"
npm install -g pm2

echo "--- Setting up MariaDB ---"
# ... (rest of MariaDB setup)
if [ ! -d "$PREFIX/var/lib/mysql" ]; then
    mysql_install_db
fi

if ! pgrep -x "mysqld" > /dev/null; then
    echo "Starting MariaDB..."
    mysqld_safe -u root > /dev/null 2>&1 &
    sleep 5
fi

echo "--- Creating Database ---"
mysql -u root -e "CREATE DATABASE IF NOT EXISTS bus_booking;"

echo "--- Cloning Repository ---"
if [ -d "nusbooking" ]; then
    echo "Directory 'nusbooking' already exists. Pulling latest changes..."
    cd nusbooking
    git pull
else
    git clone https://github.com/Shahenvaz/nusbooking.git
    cd nusbooking
fi

echo "--- Setting up Backend ---"
cd backend
npm install
if [ ! -f ".env" ]; then
    cat <<EOT > .env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bus_booking
JWT_SECRET=your_super_secret_jwt_key_123
EOT
fi
echo "Starting Backend with PM2..."
pm2 start "npm run dev" --name "bus-backend"

echo "--- Setting up Frontend ---"
cd ../frontend/my-react-app
npm install
echo "Starting Frontend with PM2..."
pm2 start "npm run dev" --name "bus-frontend"

echo "--- Setting up Cloudflare Tunnel ---"
echo "Starting Cloudflare Tunnel for Frontend (Port 5173)..."
# We run cloudflared in a way that we can capture the URL or just let it run in PM2
pm2 start "cloudflared tunnel --url http://localhost:5173" --name "cloudflare-tunnel"

echo "--- Setup Complete! ---"
echo ""
echo "Processes running in background:"
pm2 list
echo ""
echo "--- IMPORTANT ---"
echo "To find your public Cloudflare URL, run:"
echo "pm2 logs cloudflare-tunnel"
echo ""
echo "Note: If your frontend cannot talk to the backend, you may need to start"
echo "another tunnel for the backend (Port 5000) and update the API URL in"
echo "frontend/my-react-app/src/api/axios.ts"

