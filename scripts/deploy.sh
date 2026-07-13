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
echo "Installing dependencies..."
npm install

# ---------------------------------------------------------------------------- #
echo "Building react app..."
sudo npm run build
