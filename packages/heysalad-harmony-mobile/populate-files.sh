#!/bin/bash

# bereit Mobile - File Population Script
# This script creates all necessary files in your project

echo "📝 Creating all necessary files for bereit mobile app..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to create file with content
create_file() {
    local filepath=$1
    local description=$2
    
    if [ -f "$filepath" ]; then
        echo -e "${YELLOW}⚠️  Skipping${NC} $filepath (already exists)"
    else
        echo -e "${GREEN}✅ Created${NC} $filepath"
    fi
}

# Create constants/colors.ts
cat > src/constants/colors.ts << 'EOF'
export const COLORS = {
  // Brand colors
  primary: '#00bcd4',
  secondary: '#1e3a5f',
  
  // Status colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  // Neutrals
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // UI elements
  background: '#ffffff',
  surface: '#f5f5f5',
  border: '#e0e0e0',
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#bdbdbd',
    inverse: '#ffffff',
  },
  
  // Gradients
  gradient: {
    primary: ['#00bcd4', '#0097a7'],
    secondary: ['#1e3a5f', '#152a45'],
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const TYPOGRAPHY = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;
EOF
create_file "src/constants/colors.ts" "Design system constants"

echo ""
echo "✨ All files created successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Review the .env file with your Firebase credentials"
echo "   2. Run: npm install"
echo "   3. Run: npm start"
echo ""