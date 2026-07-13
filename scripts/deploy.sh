#!/bin/bash
set -euo pipefail

# ---------------------------------------------------------------------------- #
echo "Entering frontend directory..."
cd ~/Dev/gaby/gaby-shared-album-frontend

# ---------------------------------------------------------------------------- #
echo "Loading env..."
set -a
source .env
set +a

# ---------------------------------------------------------------------------- #
echo "Pulling latest code..."
git pull origin main

# ---------------------------------------------------------------------------- #
echo "Installing dependencies..."
npm install

# ---------------------------------------------------------------------------- #
echo "Building react app..."
npm run build
