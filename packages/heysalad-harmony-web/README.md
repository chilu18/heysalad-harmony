# bereit - Professional HR Onboarding Platform

**bereit** is a comprehensive HR management platform built for modern logistics and warehouse operations. The platform streamlines employee onboarding, visa processing, payroll management, and operational workflows with AI-powered document generation.

## Overview

bereit helps HR teams and operations managers efficiently manage their workforce through:

- **Multi-Package System**: Onboarding, Visa, Pay, and Bonus packages
- **AI-Powered Documentation**: Automated generation of employment contracts, visa documents, and compliance paperwork
- **Role-Based Access**: Tailored dashboards for HR Managers, Operations Managers, and Warehouse Staff
- **Real-Time Tracking**: Timesheets, payslips, and performance monitoring
- **Compliance Management**: Safety tracking, legal documentation, and regulatory compliance

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **AI**: OpenAI GPT-4 + HuggingFace (Document Generation)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **PDF Generation**: jsPDF

## Project Structure

```
bereit-hr-platform/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Layout.tsx              # Main layout with sidebar
│   │   ├── onboarding/
│   │   │   ├── CreatePackageModal.tsx  # Onboarding package creation
│   │   │   └── PackageViewModal.tsx    # Full-page document viewer
│   │   └── packages/
│   │       ├── CreateVisaPackageModal.tsx    # Visa package wizard
│   │       └── PackageSelectionModal.tsx     # Package type selector
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx           # Authentication
│   │   │
│   │   ├── hr-manager/
│   │   │   ├── HRManagerDashboard.tsx  # HR overview dashboard
│   │   │   ├── Packages.tsx            # Package management
│   │   │   ├── Employees.tsx           # Employee directory
│   │   │   ├── Approvals.tsx           # HR approvals queue
│   │   │   ├── Finance.tsx             # Payroll & budgets
│   │   │   ├── Legal.tsx               # Contracts & compliance
│   │   │   ├── Documents.tsx           # Document management
│   │   │   └── IT.tsx                  # IT management
│   │   │
│   │   ├── operations-manager/
│   │   │   ├── OperationsManagerDashboard.tsx
│   │   │   ├── TeamOverview.tsx        # Team performance
│   │   │   ├── SafetyCompliance.tsx    # Safety tracking
│   │   │   ├── Locations.tsx           # Warehouse locations
│   │   │   ├── Approvals.tsx           # Operations approvals
│   │   │   ├── Procurement.tsx         # Purchase orders
│   │   │   └── Finance.tsx             # Operational costs
│   │   │
│   │   ├── warehouse-staff/
│   │   │   ├── WarehouseStaffDashboard.tsx
│   │   │   ├── MyDocuments.tsx         # Personal documents
│   │   │   └── MySchedule.tsx          # Shift schedule
│   │   │
│   │   ├── shared/
│   │   │   ├── Timesheets.tsx          # Time tracking (all roles)
│   │   │   ├── Payslips.tsx            # Salary statements
│   │   │   ├── Benefits.tsx            # Insurance & pension
│   │   │   ├── Wellbeing.tsx           # Wellness resources
│   │   │   └── Settings.tsx            # User preferences
│   │   │
│   │   └── LandingPage.tsx             # Public landing page
│   │
│   ├── services/
│   │   ├── authService.ts              # Firebase authentication
│   │   ├── aiService.ts                # OpenAI integration
│   │   ├── visaAiService.ts            # Visa document generation
│   │   ├── packageService.ts           # Package CRUD operations
│   │   ├── visaPackageService.ts       # Visa package management
│   │   ├── contractService.ts          # Contract generation
│   │   ├── interviewService.ts         # Interview scheduling
│   │   └── shiftService.ts             # Shift management
│   │
│   ├── config/
│   │   └── firebase.ts                 # Firebase configuration
│   │
│   ├── types/
│   │   └── index.ts                    # TypeScript interfaces
│   │
│   ├── App.tsx                         # Main app component
│   └── main.tsx                        # Entry point
│
├── public/
├── .gitignore
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Features by Role

### HR Manager
- Create and manage employee packages (Onboarding, Visa, Pay, Bonus)
- Employee directory and lifecycle management
- Approve job offers, salary changes, and leave requests
- Financial overview (payroll, benefits, recruitment costs)
- Legal compliance (contracts, GDPR, regulations)
- Document management system
- IT asset management

### Operations Manager
- Team performance dashboard
- Safety compliance tracking and incident reporting
- Multi-location warehouse management
- Procurement and purchase order management
- Operational finance tracking
- Team approval workflows

### Warehouse Staff
- Personal document access
- Shift schedule viewing
- Time tracking with clock-in/clock-out
- Payslip downloads
- Benefits information
- IT support tickets

## Shared Features (All Roles)
- Real-time timesheets with working timer
- Monthly payslip access and download
- Insurance and pension benefits tracking
- Wellness and wellbeing resources
- IT support system
- Comprehensive settings management

## Package System

bereit supports multiple package types for different HR needs:

### 1. Onboarding Package
Complete employee onboarding with automated document generation:
- Employment contracts
- Company policies
- Training schedules
- Equipment assignment
- Welcome materials

### 2. Visa Package
Streamlined visa application support for German work permits:
- **EU Blue Card**: For highly qualified professionals
- **Chancenkarte**: Points-based opportunity card
- **Service Provider**: For self-employed professionals
- **Self-Employed**: For entrepreneurs
- **ICT**: Intra-company transfers

Auto-generates:
- Job descriptions (German & English)
- Employment contracts (Arbeitsvertrag)
- Employer declarations
- Visa application forms
- Qualification recognition guides
- Application checklists

### 3. Pay Package (Coming Soon)
- Salary contracts
- Tax documentation
- Payment setup

### 4. Bonus Package (Coming Soon)
- Performance bonuses
- Incentive documentation
- Reward programs

## Installation

### Prerequisites
- Node.js 20.19+ or 22.12+ (recommended)
- npm, yarn, or pnpm
- Firebase account
- OpenAI API account
- HuggingFace API account (optional)

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/your-username/bereit-hr-platform.git

# Navigate to project directory
cd bereit-hr-platform

# Install dependencies (choose one)
npm install
# or
pnpm install  # Recommended for faster installation
# or
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys (see Environment Variables section below)

# Run development server
npm run dev
# or
pnpm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory (use `.env.example` as template):

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Navigate to Project Settings > General
4. Scroll down to "Your apps" and click "Web app"
5. Copy the Firebase configuration values

### OpenAI Setup
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Navigate to API Keys section
3. Create a new API key
4. Copy the key (it will only be shown once)

### HuggingFace Setup (Optional)
1. Go to [HuggingFace](https://huggingface.co/)
2. Navigate to Settings > Access Tokens
3. Create a new token
4. Copy the token

### Environment Variables Template

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Hugging Face Configuration (Optional)
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
VITE_HUGGINGFACE_MODEL=openai/gpt-oss-120b
```

**Important:** Never commit your `.env` file to version control. It's already included in `.gitignore`.

## Available Scripts

```bash
# Development
npm run dev          # Start development server (Vite)
pnpm run dev         # Start with pnpm (recommended)
yarn dev             # Start with yarn

# Production
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint for code quality checks
```

## Troubleshooting

### Installation Issues

**Problem:** Dependencies fail to install or `vite` command not found

**Solutions:**
1. Clear npm cache: `npm cache clean --force`
2. Delete `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
3. Try using pnpm instead: `pnpm install` (faster and more reliable)
4. Check Node.js version: `node --version` (should be 20.19+ or 22.12+)

**Problem:** Disk space issues

**Solution:** Free up at least 1-2 GB of disk space before installing dependencies

### Runtime Issues

**Problem:** Firebase errors or authentication not working

**Solution:**
- Verify all Firebase environment variables are correctly set in `.env`
- Check Firebase project settings and ensure web app is properly configured
- Make sure Firestore and Authentication are enabled in Firebase Console

**Problem:** OpenAI API errors

**Solution:**
- Verify your OpenAI API key is valid and has credits
- Check if you've exceeded your rate limits
- Ensure the API key has proper permissions

## Key Features

### AI-Powered Document Generation
- Automatic contract creation using OpenAI GPT-4
- Visa documentation in compliance with German immigration law
- Multi-language support (German & English)
- PDF generation with company branding

### Role-Based Access Control
Three distinct user roles with tailored interfaces:
- HR Manager: Full access to all HR functions
- Operations Manager: Team and operational management
- Warehouse Staff: Personal documents and schedules

### Real-Time Tracking
- Live timesheet tracking with working timer
- Automatic payroll calculations
- Performance metrics and analytics

### Compliance & Legal
- GDPR-compliant data handling
- German labor law compliance
- Document version control
- Audit trails

## Design System

### Brand Colors
- Primary: #00bcd4 (Cyan)
- Secondary: #1e3a5f (Navy Blue)
- Accent: #00bcd4

### Design Principles
- Square corners (no rounded borders)
- Clean white backgrounds
- Minimal, functional UI
- Mobile-responsive design

## Deployment

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

### Other Hosting Options

The built files in the `dist/` folder can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Cloudflare Pages

## Roadmap

### Phase 1 (Completed)
- [x] Authentication system
- [x] Role-based dashboards
- [x] Onboarding package creation
- [x] Visa package generation
- [x] Document management
- [x] Time tracking
- [x] Settings management

### Phase 2 (In Progress)
- [ ] Pay package implementation
- [ ] Bonus package system
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Enhanced reporting and exports

### Phase 3 (Planned)
- [ ] Learning & Development module with 11 Labs voice AI
- [ ] Wellbeing program integration
- [ ] API for third-party integrations
- [ ] Advanced reporting tools
- [ ] Multi-language support
- [ ] White-label customization

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Security

If you discover any security vulnerabilities, please email security@bereit.works instead of using the issue tracker.

### Security Best Practices

1. Never commit `.env` files to version control
2. Rotate API keys regularly
3. Use Firebase Security Rules to protect your database
4. Implement proper authentication checks in all routes
5. Keep dependencies updated: `npm audit fix`

## Contact

For questions or support, please contact:
- Email: support@bereit.works
- Website: https://bereit.works
- GitHub Issues: [Report a bug](https://github.com/your-username/bereit-hr-platform/issues)

## Acknowledgments

Built with modern web technologies:
- React Team for React 18
- Vercel for Vite
- Firebase Team for backend services
- OpenAI for AI capabilities
- Tailwind Labs for Tailwind CSS

---

**bereit** - Streamlining HR operations for the modern workplace.
