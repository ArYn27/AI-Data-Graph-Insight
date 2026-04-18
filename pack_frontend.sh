#!/bin/bash

# Configuration
OUTPUT_FILE="frontend_setup.zip"

echo "📦 Packaging frontend for migration..."

# Remove old setup file if exists
rm -f "$OUTPUT_FILE"

# Create a zip archive excluding node_modules, .git, and backend files
zip -r "$OUTPUT_FILE" . \
    -x "node_modules/*" \
    -x ".git/*" \
    -x "backend/*" \
    -x "frontend_setup.zip" \
    -x ".DS_Store" \
    -x "*.pyc" \
    -x "__pycache__/*"

if [ $? -eq 0 ]; then
    echo "✅ Success! Your frontend is packaged in $OUTPUT_FILE"
    echo "Move this file to your other computer and follow INSTALL_FRONTEND.md"
else
    echo "❌ Failed to create package."
fi
