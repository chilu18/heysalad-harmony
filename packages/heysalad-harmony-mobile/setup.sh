#!/bin/bash

# bereit Mobile App Setup Script
# For MacBook M1 2020

echo "🚀 Setting up bereit Mobile App..."
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Please upgrade Node.js"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Install global dependencies
echo "📦 Installing global dependencies..."
npm install -g expo-cli eas-cli
echo ""

# Install project dependencies
echo "📦 Installing project dependencies..."
npm install
echo ""

# Install babel plugin for path aliases
echo "📦 Installing babel-plugin-module-resolver..."
npm install --save-dev babel-plugin-module-resolver
echo ""

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p src/components
mkdir -p src/screens/auth
mkdir -p src/screens/hr-manager
mkdir -p src/screens/operations-manager
mkdir -p src/screens/warehouse-staff
mkdir -p src/screens/shared
mkdir -p src/navigation
mkdir -p src/services/firebase
mkdir -p src/services/biometric
mkdir -p src/services/location
mkdir -p src/contexts
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/constants
mkdir -p assets
echo "✅ Directories created"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your Firebase credentials"
else
    echo "✅ .env file already exists"
fi
echo ""

# iOS specific setup (for M1 Mac)
if [[ $(uname -m) == 'arm64' ]]; then
    echo "🍎 Detected Apple Silicon (M1)..."
    echo "ℹ️  Note: If you encounter issues with iOS, run:"
    echo "   cd ios && arch -x86_64 pod install"
    echo ""
fi

# Check if Firebase config needs updating
if grep -q "YOUR_API_KEY" src/services/firebase/config.ts 2>/dev/null; then
    echo "⚠️  IMPORTANT: Update Firebase configuration in:"
    echo "   src/services/firebase/config.ts"
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Update src/services/firebase/config.ts with your Firebase credentials"
echo "   2. Update .env file if needed"
echo "   3. Run 'npm start' to start the development server"
echo "   4. Run 'npm run ios' for iOS simulator (Mac only)"
echo "   5. Run 'npm run android' for Android emulator"
echo ""
echo "📚 For more information, see README.md"
echo ""