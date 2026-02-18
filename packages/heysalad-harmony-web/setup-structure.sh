#!/bin/bash

# Create shared pages directory
mkdir -p src/pages/shared

# Create shared page files
touch src/pages/shared/Timesheets.tsx
touch src/pages/shared/Payslips.tsx
touch src/pages/shared/Benefits.tsx
touch src/pages/shared/Wellbeing.tsx

# Create operations manager pages
touch src/pages/operations-manager/TeamOverview.tsx
touch src/pages/operations-manager/SafetyCompliance.tsx
touch src/pages/operations-manager/Locations.tsx
touch src/pages/operations-manager/Procurement.tsx
touch src/pages/operations-manager/Approvals.tsx

# Create hr manager pages
touch src/pages/hr-manager/Employees.tsx
touch src/pages/hr-manager/Documents.tsx
touch src/pages/hr-manager/Legal.tsx
touch src/pages/hr-manager/Finance.tsx
touch src/pages/hr-manager/Approvals.tsx

# Create warehouse staff pages
touch src/pages/warehouse-staff/MyDocuments.tsx
touch src/pages/warehouse-staff/MySchedule.tsx

echo "✅ All folders and files created successfully!"