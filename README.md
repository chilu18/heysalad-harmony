# HeySalad Harmony 🥗🎵

> Resource management suite for humans and AI agents

HeySalad Harmony is a monorepo containing the complete suite for coordinating and managing resources across human operators and AI agents. Built to scale the HeySalad platform's autonomous operations.

## 📦 Packages

| Package | Description | Status |
|---------|-------------|--------|
| **[@heysalad/harmony](./packages/harmony)** | Core library for resource management | ✅ Active |
| **[heysalad-harmony-api](./packages/heysalad-harmony-api)** | REST API for Harmony platform | ✅ Active |
| **[heysalad-harmony-web](./packages/heysalad-harmony-web)** | Web dashboard for resource management | ✅ Active |
| **[heysalad-harmony-mobile](./packages/heysalad-harmony-mobile)** | Mobile app for on-the-go management | ✅ Active |
| **[heysalad-harmony-extension](./packages/heysalad-harmony-extension)** | Browser extension for quick access | ✅ Active |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/heysalad/heysalad-harmony.git
cd heysalad-harmony

# Install dependencies for all packages
npm install

# Build all packages
npm run build

# Run development mode
npm run dev
```

## 🏗️ Architecture

HeySalad Harmony manages three core primitives:

1. **Agents** - Human operators and AI agents with capabilities and status
2. **Resources** - API keys, databases, compute, storage, etc.
3. **Tasks** - Work items assigned to agents with priority and status

### Core Library (@heysalad/harmony)

```typescript
import { Harmony } from '@heysalad/harmony';

const harmony = new Harmony();

// Register AI agent
harmony.agents.register({
  id: 'shopping-agent-1',
  name: 'Shopping Agent',
  type: 'ai',
  status: 'active',
  capabilities: ['shopping', 'price-comparison', 'checkout']
});

// Allocate resource
harmony.resources.allocate({
  id: 'stripe-key-1',
  name: 'Stripe API Key',
  type: 'api-key',
  owner: 'shopping-agent-1',
  status: 'available'
});

// Create task
harmony.tasks.create({
  id: 'task-1',
  title: 'Purchase groceries for order #123',
  description: 'Buy 10 items from Tesco',
  assignedTo: 'shopping-agent-1',
  status: 'pending',
  priority: 'high',
  createdAt: new Date(),
  updatedAt: new Date()
});
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm 9+

### Project Structure

```
heysalad-harmony/
├── packages/
│   ├── harmony/                    # @heysalad/harmony npm library
│   │   ├── src/
│   │   │   └── index.ts           # Core library code
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── heysalad-harmony-api/       # Cloudflare Worker API
│   ├── heysalad-harmony-web/       # React web dashboard
│   ├── heysalad-harmony-mobile/    # React Native mobile app
│   └── heysalad-harmony-extension/ # Browser extension
├── package.json                    # Root package with workspaces
└── README.md
```

### Commands

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test

# Clean build artifacts
npm run clean
```

## 🔗 Integration with HeySalad Platform

Harmony integrates with the broader HeySalad ecosystem:

- **heysalad-agent** - Core orchestrator uses Harmony for agent coordination
- **heysalad-agents** - Multi-agent service registers agents with Harmony
- **shopping-agent** - Shopping automation agent managed by Harmony
- **delivery-agent** - Delivery logistics agent managed by Harmony
- **finance-agent** - Payment processing agent managed by Harmony

## 📊 Use Cases

### 1. AI Agent Fleet Management
Monitor and coordinate multiple AI agents across the HeySalad platform:
- Track agent health and status
- Allocate API keys and resources
- Load balance tasks across agents

### 2. Human Operator Dashboard
Empower human operators to oversee autonomous operations:
- View real-time agent activity
- Intervene when agents need help
- Approve high-risk operations

### 3. Resource Optimization
Efficiently manage shared resources:
- Track API usage and costs
- Allocate compute resources
- Monitor database connections

## 🔐 Security

- API authentication via HeySalad OAuth
- Resource access control by agent capabilities
- Audit logging for all operations
- Secrets managed via Cloudflare Workers secrets

## 📄 License

MIT © HeySalad Payments Ltd

## 👨‍💻 Author

**Peter Machona**
HeySalad Payments Ltd
3rd Floor, 86-90 Paul Street
London, EC2A 4NE
United Kingdom

---

*Part of the HeySalad AI-first food-tech operating system*
