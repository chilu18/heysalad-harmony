# Bereit - Workforce Management System

**A modern, multi-role mobile application for warehouse workforce management built with React Native, Expo, and Firebase.**

---

## 🚀 Project Overview

Bereit is a comprehensive workforce management solution designed for warehouse operations. It provides role-based access for HR Managers, Operations Managers, and Warehouse Staff, enabling seamless employee onboarding, shift scheduling, time tracking, and document management.

### Key Features

- **Multi-role Authentication** - Three distinct user roles with customized experiences
- **Real-time Dashboard** - Live metrics and KPIs for each role
- **Shift Management** - Create, view, and manage employee schedules
- **Time Clock** - Location-verified clock in/out functionality
- **Document Generation** - Automated contract and report creation
- **Notifications** - Unified notification system across all roles
- **Employee Onboarding** - Streamlined onboarding with progress tracking

---

## 📱 Tech Stack

- **Frontend:** React Native + Expo SDK 51
- **Language:** TypeScript
- **Backend:** Firebase (Authentication + Firestore)
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **State Management:** React Context API
- **Storage:** AsyncStorage for local persistence
- **Styling:** Custom design system with brand colors

---

## 🎨 Design System

### Brand Colors
```typescript
Primary (Cyan):    #06B6D4  // Main brand color
Secondary (Gold):  #F59E0B  // Accent color
Success:           #10B981  // Positive actions
Warning:           #F59E0B  // Cautions
Error:             #EF4444  // Errors
Info:              #3B82F6  // Information
```

### Design Principles
- **Consistent spacing** using 4px base unit (xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48)
- **2x2 stats grid** for dashboard KPIs
- **Reusable form components** following DRY principles
- **Branded loading screens** across all views
- **Modern card-based layouts** with subtle shadows

---

## 🏗️ Project Structure

```
bereit/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── forms/          # FormInput, FormPicker components
│   ├── constants/          # colors.ts - Design system tokens
│   ├── contexts/           # AuthContext for authentication
│   ├── navigation/         # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   └── tabs/          # Role-based tab navigators
│   │       ├── HRManagerTabs.tsx
│   │       ├── OperationsManagerTabs.tsx
│   │       └── WarehouseStaffTabs.tsx
│   ├── screens/           # All application screens
│   │   ├── auth/          # LoginScreen, SignupScreen
│   │   ├── hr-manager/    # 6 screens (Dashboard, AddEmployee, etc.)
│   │   ├── operations-manager/
│   │   ├── warehouse-staff/
│   │   └── shared/        # LoadingScreen, NotificationsScreen, ProfileScreen
│   ├── services/
│   │   └── firebase/      # config.ts - Firebase initialization
│   └── types/             # TypeScript type definitions
├── assets/                # Images, fonts, icons
└── App.tsx               # Root component
```

---

## 👥 User Roles & Features

### HR Manager
**Access Level:** Full administrative control

**Dashboard Stats:**
- Active Employees
- Currently Clocked In
- Pending Approvals
- Today's Shifts

**Features:**
- ✅ Add new employees
- ✅ Create and manage shifts
- ✅ Manage approvals (leave, timesheets, expenses)
- ✅ Generate documents (contracts, reports)
- ✅ View all employee schedules
- ✅ Access complete employee database

**Screens:**
- Dashboard
- Add Employee Form
- Schedule Management
- Create Shift Form
- Timesheet Approval
- Document Generation
- Notifications
- Profile

### Operations Manager
**Access Level:** Operational oversight

**Dashboard Stats:**
- Team Members
- Floor Ready %
- Safety Compliance
- Active Locations

**Features:**
- ✅ View team analytics
- ✅ Monitor location status
- ✅ Track safety compliance
- ✅ Oversee shift coverage
- ✅ Clock in/out capability
- ⏳ Team performance reports (planned)

**Screens:**
- Dashboard with location cards
- Clock In/Out
- Schedule View
- Notifications
- Profile

### Warehouse Staff
**Access Level:** Personal data only

**Dashboard Features:**
- Onboarding progress tracker (33% complete - 2/6 tasks)
- Upcoming shifts list
- Task checklist
- Quick actions

**Features:**
- ✅ Clock in/out
- ✅ View personal schedule
- ✅ Track onboarding progress
- ✅ Access documents
- ✅ Request support
- ⏳ Shift swap requests (planned)

**Screens:**
- Dashboard with onboarding
- Clock In/Out
- Personal Schedule
- Notifications
- Profile

---

## 🎓 BEUMER Equipment Training Platform

Bereit is expanding into AI-assisted technical training so logistics teams can stay certified on BEUMER Group machinery while keeping learning fun and measurable.

### Platform Highlights
- **AI Content Factory:** Use an LLM prompt library + ElevenLabs voice synthesis to turn equipment manuals into short audio/visual “tid bits” with human-sounding narration.
- **Microlearning Journeys:** Each module covers one BEUMER asset with 3‑5 minute lessons, contextual images/diagrams, and just-in-time safety callouts.
- **Knowledge Checks:** Auto-generated quizzes (single/multi choice, scenario cards) validate retention before unlocking the next lesson.
- **Gamified Rewards:** Learners earn `Bereit Points` for completion streaks, high quiz scores, and early refresher completions; companies choose reward catalogues (vouchers, gear, rota perks).
- **Multi-Role Access:** HR curates content, Operations monitors compliance, Warehouse/Drivers consume lessons on mobile, with optional supervisors approving escalations.

### Equipment Catalogue Coverage
| Category | Sample Equipment | Training Emphasis |
| --- | --- | --- |
| **Baggage Handling Systems** | BEUMER autover®, CrisBag®, CrisBelt®, Tilt-Tray Sorters, Automated Loaders | System startup/shutdown, routing logic, passenger interaction, emergency stops, EHS protocols |
| **Logistics & Sortation** | BG Sorter® CB/ET, BG Line Sorter, BG Pouch System, Parcel Belt Conveyors, WCS | Induction flows, sorting algorithms, jam clearance, KPI dashboards, advanced troubleshooting |
| **Heavy Conveying** | Troughed/Overland/Pipe Conveyors, Bucket Elevators, Tripper Cars, AFR systems | Belt tensioning & splicing, drive systems, fall protection, dust control, zero-speed safety |
| **Specialised Systems** | Stockyard, Opencast Mining, Port Technology, Mineral Processing | Load distribution, weather mitigation, vehicle exclusion zones, rescue protocols |
| **End-of-Line Packaging** | BEUMER paletpac®, fillpac®, stretch hood®, Robotic Palletisers | Robot safety, pattern programming, product changeover, film tuning, lock-out/tag-out |

Detailed lesson plans map back to the manufacturer’s recommended durations (e.g. 5–10 day cross-belt sorter programs, 3–5 day bucket-elevator refreshers) and enforce prerequisite certifications (airport ops, WCS operator, robot safety, etc.).

### Safety & Compliance Matrix
- **Core PPE & Permits:** Steel-toe footwear, high-vis gear, hearing protection, LOTO certification, confined-space permits, hot-work approvals.
- **Equipment-Specific Controls:** Light curtains on sorters, belt guards/pull cords on conveyors, collaborative robot zones, dust suppression for AFR conveyors, vehicle exclusion zones on mining/port systems.
- **Medical Surveillance:** Audiometry, respiratory monitoring, vibration assessments, silica/coaldust tracking where applicable.
- **Standards Alignment:** ISO 45001, ISO 12100, ISO 13849-1, IEC 60204-1, ISO 10218, EN 1889, ANSI B20.1, AS 1755, plus regional directives (CE, OSHA, PUWER, MSHA, WHS).

### Learning Flow
1. **Discover:** HR/Operations select a BEUMER asset and instantiate a training journey template.
2. **Author:** Prompt the LLM with equipment scope; curate AI text, inject SME notes, and synthesize audio narration via ElevenLabs.
3. **Publish:** Push modules, safety checklists, and quizzes to Firebase with effective dates, target roles, and required certifications.
4. **Engage:** Warehouse staff & drivers receive push reminders, listen to bite-sized clips, complete quizzes, and earn Bereit Points.
5. **Audit:** Dashboards surface completion %, quiz outcomes, refresher deadlines, and open safety actions for HR/Ops leaders.

### Firebase Data Model (Draft)
```
trainingModules/
  {moduleId} {
    title,
    equipmentCategory,
    equipmentItems: string[],
    durationEstimate,
    lessonRefs: string[],
    requiredCertifications: string[],
    safetyNotes,
    rewardPoints,
    createdBy,
    status (draft/published/archived),
    webAuthoringMetadata { llmPrompt, elevenLabsVoice, versionHistory[] }
  }

lessons/
  {lessonId} {
    moduleId,
    order,
    contentMarkdown,
    audioUrl,
    attachments[],
    quizRef,
    estimatedMinutes
  }

quizzes/
  {quizId} {
    moduleId,
    questions: [
      { type, prompt, choices[], answerKey, explanation }
    ],
    passingScore
  }

userProgress/
  {userId_moduleId} {
    userId,
    moduleId,
    status (not_started/in_progress/completed),
    score,
    attempts,
    awardedPoints,
    timestamps { startedAt, completedAt, lastTouched }
  }
```

### Web Admin & Analytics
- **Content Workbench:** Rich text + attachment editor, AI prompt sidebar, ElevenLabs voice picker, preview + publish workflow, version history.
- **Assignment Rules:** Target by role (HR, Ops, Warehouse, Driver), site, certification expiry date, or custom cohorts.
- **Compliance Dashboards:** Completion funnels, quiz performance heat maps, overdue refresher alerts, downloadable audit trails (CSV/PDF).
- **Reward Management:** Configure point multipliers, approve redemption catalogues, export payroll or gift-card batches.

### Mobile App Experience
- Home widgets showing active modules, streaks, and Bereit Points.
- Offline-first lesson caching with resume state.
- Quiz interactions with instant feedback and remediation content.
- Safety checklist acknowledgements and incident escalation hooks.

---

---

## 🔐 Authentication & Security

- **Firebase Authentication** with email/password
- **Role-based access control (RBAC)** with secure role assignment
- **Protected routes** per user role
- **Persistent session management** using AsyncStorage
- **Multi-role support** - users can switch between assigned roles

---

## 📊 Database Schema (Firestore)

### Collections

#### Users Collection
```typescript
{
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  role: 'hr_manager' | 'operations_manager' | 'warehouse_staff',
  assignedRoles: string[],  // For users with multiple roles
  status: 'active' | 'inactive',
  createdAt: Timestamp,
  phoneNumber?: string,
  warehouseId?: string,
}
```

#### Shifts Collection
```typescript
{
  id: string,
  userId: string,
  date: Timestamp,
  startTime: string,        // e.g., "09:00"
  endTime: string,          // e.g., "17:00"
  position: string,
  warehouseId: string,
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
  notes?: string,
  createdAt: Timestamp,
}
```

#### TimeEntries Collection
```typescript
{
  id: string,
  userId: string,
  clockIn: Timestamp,
  clockOut?: Timestamp,
  location: {
    latitude: number,
    longitude: number,
  },
  status: 'active' | 'completed',
  notes?: string,
}
```

#### Notifications Collection (Planned)
```typescript
{
  id: string,
  userId: string,
  type: 'shift' | 'approval' | 'document' | 'announcement' | 'alert',
  title: string,
  message: string,
  timestamp: Timestamp,
  read: boolean,
  actionable: boolean,
}
```

---

## 🚦 Current Status

### ✅ Completed Features
- [x] Multi-role authentication system
- [x] Three role-based dashboards with 2x2 stats
- [x] Role switcher in Profile
- [x] Unified notifications screen
- [x] LoadingScreen with branding
- [x] Add Employee form
- [x] Schedule Management screen
- [x] Create Shift form with dropdowns
- [x] Timesheet Approval screen
- [x] Document Generation templates
- [x] Reusable form components (FormInput, FormPicker)
- [x] Pull-to-refresh on all dashboards
- [x] Navigation stacks for all roles

### 🚧 In Progress
- [ ] Location services for Clock In/Out
- [ ] Firestore data integration
- [ ] Real-time stats calculation

### 📋 Planned Features
See [ROADMAP.md](#-roadmap) below

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio
- Firebase account

### Environment Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd bereit
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure Firebase:**

Create `src/services/firebase/config.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

4. **Configure Environment Variables:**

Create a `.env` file (or update the existing one) with the following keys:
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=...

# AI + Voice Integrations
EXPO_PUBLIC_OPENAI_API_KEY=...
EXPO_PUBLIC_ELEVENLABS_API_KEY=...
EXPO_PUBLIC_ELEVENLABS_AGENT_ID=...
EXPO_PUBLIC_ELEVENLABS_VOICE_ID=...
```

5. **Start the development server:**
```bash
npx expo start
```

6. **Run on device:**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

---

## 🧪 Testing

### Test Accounts
Create these test accounts in Firebase:

**HR Manager:**
```
Email: hr@bereit.com
Password: Test123!
Role: hr_manager
```

**Operations Manager:**
```
Email: ops@bereit.com
Password: Test123!
Role: operations_manager
```

**Warehouse Staff:**
```
Email: staff@bereit.com
Password: Test123!
Role: warehouse_staff
```

### Manual Testing Checklist
- [ ] Login with each role
- [ ] Switch between roles in Profile
- [ ] Navigate all tabs
- [ ] Create a shift (HR Manager)
- [ ] View notifications
- [ ] Pull to refresh dashboards
- [ ] Check loading screens

---

## 📦 Dependencies

### Core
```json
{
  "expo": "~51.0.0",
  "react": "18.2.0",
  "react-native": "0.74.0",
  "typescript": "^5.1.3"
}
```

### Navigation
```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "@react-navigation/stack": "^6.3.20",
  "react-native-screens": "~3.31.1",
  "react-native-safe-area-context": "4.10.1"
}
```

### Firebase
```json
{
  "firebase": "^10.7.1"
}
```

### UI Components
```json
{
  "@expo/vector-icons": "^14.0.0",
  "@react-native-community/datetimepicker": "^8.2.0",
  "@react-native-async-storage/async-storage": "1.23.1"
}
```

---

## 🗺️ ROADMAP

### Phase 1: Core Functionality (CURRENT - Weeks 1-2)
**Goal:** Make existing features fully functional  
**Priority:** CRITICAL

- [ ] **Location Services Integration**
  - Implement geolocation for Clock In/Out
  - Add geofencing to verify warehouse proximity
  - Request and handle location permissions
  - Store location data with time entries

- [ ] **Seed Test Data**
  - Create sample employees (10-15)
  - Generate sample shifts (past and future)
  - Add time entries for statistics
  - Populate all Firestore collections

- [ ] **Connect Add Employee Form**
  - Create Firebase Auth accounts
  - Write employee data to Firestore
  - Implement form validation
  - Send welcome notifications
  - Handle duplicate emails

- [ ] **Real Dashboard Data**
  - Connect all stats to Firestore queries
  - Implement real-time updates
  - Add error handling
  - Show loading states

**Deliverable:** Functional MVP with working core features

### Phase 2: Document & Workflow Management (Weeks 3-4)
**Goal:** Complete document generation and approval workflows  
**Priority:** HIGH

- [ ] **Document Generation**
  - Integrate PDF generation library (react-native-pdf)
  - Create document templates (contracts, reports)
  - Implement template variables
  - Add document preview
  - Store generated documents in Firebase Storage
  - Send document notifications

- [ ] **Timesheet Approval Workflow**
  - Fetch pending timesheets from Firestore
  - Implement approve/reject actions
  - Add comments/notes functionality
  - Send approval notifications
  - Update timesheet status

- [ ] **Shift Management Enhancement**
  - Edit existing shifts
  - Delete/cancel shifts
  - Bulk shift creation
  - Conflict detection
  - Shift templates

**Deliverable:** Complete HR workflow from hire to timesheet approval

### Phase 3: Enhanced UX & Notifications (Weeks 5-6)
**Goal:** Polish user experience and implement real notifications  
**Priority:** MEDIUM

- [ ] **Real Notifications System**
  - Integrate Firebase Cloud Messaging (FCM)
  - Implement push notifications
  - Add in-app notification center
  - Create notification preferences
  - Real badge counts from Firestore

- [ ] **Quick Actions Implementation**
  - Wire up all Quick Action buttons
  - Add navigation to relevant screens
  - Implement action shortcuts
  - Add recently used actions

- [ ] **Enhanced Clock In/Out**
  - Add photo capture on clock in
  - Break time tracking
  - Overtime calculations
  - Clock in reminders
  - GPS breadcrumb trail

- [ ] **Search & Filters**
  - Search employees (HR Manager)
  - Filter shifts by date, location, employee
  - Filter notifications
  - Advanced filtering options

**Deliverable:** Polished, production-ready UX

### Phase 4: Analytics & Reporting (Weeks 7-8)
**Goal:** Add comprehensive analytics and reporting  
**Priority:** MEDIUM

- [ ] **HR Manager Analytics**
  - Employee performance metrics
  - Attendance reports
  - Shift coverage analysis
  - Cost analysis
  - Export reports (PDF/CSV)

- [ ] **Operations Manager Dashboard**
  - Real-time floor monitoring
  - Productivity metrics
  - Safety incident tracking
  - Location utilization charts
  - Weekly/monthly summaries

- [ ] **Warehouse Staff Insights**
  - Personal attendance history
  - Hours worked summary
  - Performance reviews
  - Earnings calculator
  - Goal tracking

- [ ] **Data Visualization**
  - Charts and graphs (recharts or victory-native)
  - Trend analysis
  - Comparative reports
  - Custom date ranges

**Deliverable:** Comprehensive analytics suite

### Phase 5: Collaboration Features (Weeks 9-10)
**Goal:** Enable team communication and collaboration  
**Priority:** LOW

- [ ] **Team Chat/Messaging**
  - Direct messages between employees
  - Group chats per location
  - Announcements channel
  - File sharing
  - Read receipts

- [ ] **Shift Trading System**
  - Request shift swaps
  - Approval workflow for swaps
  - Shift pickup board
  - Automatic notifications
  - Manager override

- [ ] **Team Calendar**
  - Shared team calendar view
  - Color-coded by location/position
  - Sync with device calendar
  - Calendar export
  - Holiday management

- [ ] **Task Management**
  - Assign tasks to employees
  - Task checklists
  - Due dates and priorities
  - Task completion tracking
  - Daily task summaries

**Deliverable:** Full collaboration platform

### Phase 6: Advanced Features (Weeks 11-12)
**Goal:** Add sophisticated enterprise features  
**Priority:** LOW

- [ ] **Payroll Integration**
  - Export timesheet data
  - Integration with payroll systems
  - Overtime calculations
  - Tax withholding info
  - Pay stub generation

- [ ] **Training & Certifications**
  - Track employee certifications
  - Training module assignments
  - Expiration reminders
  - Compliance tracking
  - Quiz/test functionality

- [ ] **Performance Reviews**
  - Create review templates
  - Schedule review cycles
  - Self-assessments
  - Manager evaluations
  - Goal setting and tracking

- [ ] **Advanced Scheduling**
  - AI-powered shift suggestions
  - Automatic schedule generation
  - Conflict resolution
  - Skill-based assignment
  - Predictive staffing

**Deliverable:** Enterprise-grade workforce platform

### Phase 7: Platform & Scale (Weeks 13-16)
**Goal:** Prepare for production deployment and scale  
**Priority:** MEDIUM

- [ ] **Offline Support**
  - Local database caching
  - Offline clock in/out
  - Sync when online
  - Conflict resolution
  - Offline notifications queue

- [ ] **Multi-language Support**
  - i18n implementation
  - German and English
  - RTL support for future languages
  - Language switcher
  - Localized date/time formats

- [ ] **Performance Optimization**
  - Lazy loading
  - Image optimization
  - Query optimization
  - Code splitting
  - Caching strategies

- [ ] **Security Enhancements**
  - Two-factor authentication
  - Biometric login
  - Session management
  - API rate limiting
  - Audit logging

- [ ] **Testing & QA**
  - Unit tests (Jest)
  - Integration tests
  - E2E tests (Detox)
  - Performance testing
  - Security audit

**Deliverable:** Production-ready, scalable application

### Phase 8: Web Dashboard (Optional - Weeks 17-20)
**Goal:** Build complementary web interface  
**Priority:** LOW

- [ ] **Admin Web Portal**
  - React web app
  - Shared Firebase backend
  - Advanced reporting
  - Bulk operations
  - System configuration

- [ ] **Public Website**
  - Landing page
  - Feature documentation
  - Pricing plans
  - Contact forms
  - Blog/resources

**Deliverable:** Complete web presence

---

## 📈 Success Metrics

### Key Performance Indicators (KPIs)

**User Engagement:**
- Daily active users (DAU)
- Session duration
- Feature usage rates
- Retention rate (Day 1, 7, 30)

**Operational Efficiency:**
- Time saved on scheduling
- Reduction in timesheet errors
- Decrease in no-shows
- Document generation time

**Business Impact:**
- Labor cost optimization
- Overtime reduction
- Compliance improvement
- Employee satisfaction scores

---

## 🐛 Known Issues

1. **Location Services:** Not yet implemented - Clock In/Out doesn't verify location
2. **Real-time Updates:** Dashboard stats are cached, not live
3. **Notifications:** Using mock data, not connected to Firestore
4. **Document Generation:** Templates exist but PDF generation not implemented
5. **Search Functionality:** No search implemented yet
6. **Offline Support:** App requires internet connection

---

## 🤝 Contributing

### Git Workflow

1. Create feature branch from `main`
```bash
git checkout -b feature/your-feature-name
```

2. Make changes and commit with descriptive messages
```bash
git add .
git commit -m "Add feature: description of changes"
```

3. Push and create pull request
```bash
git push origin feature/your-feature-name
```

### Commit Message Convention
```
type(scope): subject

Examples:
feat(auth): add role switcher in profile
fix(dashboard): correct stat calculation
docs(readme): update installation steps
refactor(forms): create reusable input components
```

---

## 📝 License

[Choose appropriate license - MIT, Apache 2.0, etc.]

---

## 📞 Support & Contact

**Project Lead:** [Your Name]  
**Email:** [contact email]  
**Project Repository:** [GitHub URL]

---

## 🙏 Acknowledgments

- React Native community
- Firebase team
- Expo team
- Design inspiration from modern workforce apps

---

## 📚 Additional Documentation

- [API Documentation](docs/API.md) - Coming soon
- [Database Schema](docs/DATABASE.md) - Coming soon
- [Deployment Guide](docs/DEPLOYMENT.md) - Coming soon
- [Style Guide](docs/STYLE_GUIDE.md) - Coming soon

---

**Last Updated:** October 2025  
**Version:** 0.1.0 (MVP in Development)
