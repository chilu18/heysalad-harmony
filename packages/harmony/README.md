# @heysalad/harmony

Resource management library for humans and AI agents.

## Installation

```bash
npm install @heysalad/harmony
```

## Usage

```typescript
import { Harmony, Agent, Resource, Task } from '@heysalad/harmony';

const harmony = new Harmony();

// Register agents
const aiAgent: Agent = {
  id: 'agent-1',
  name: 'Shopping Agent',
  type: 'ai',
  status: 'active',
  capabilities: ['shopping', 'price-comparison']
};

harmony.agents.register(aiAgent);

// Allocate resources
const resource: Resource = {
  id: 'resource-1',
  name: 'Stripe API Key',
  type: 'api-key',
  owner: 'agent-1',
  status: 'available'
};

harmony.resources.allocate(resource);

// Create tasks
const task: Task = {
  id: 'task-1',
  title: 'Purchase groceries',
  description: 'Buy items from shopping list',
  assignedTo: 'agent-1',
  status: 'pending',
  priority: 'high',
  createdAt: new Date(),
  updatedAt: new Date()
};

harmony.tasks.create(task);

// Query agents
const activeAgents = harmony.agents.list({ status: 'active' });
const aiAgents = harmony.agents.list({ type: 'ai' });

// Query resources
const availableResources = harmony.resources.list({ status: 'available' });
const agentResources = harmony.resources.list({ owner: 'agent-1' });

// Query tasks
const pendingTasks = harmony.tasks.list({ status: 'pending' });
const highPriorityTasks = harmony.tasks.list({ priority: 'high' });
```

## API

### AgentManager

- `register(agent: Agent): void` - Register a new agent
- `unregister(agentId: string): boolean` - Remove an agent
- `get(agentId: string): Agent | undefined` - Get agent by ID
- `list(filters?): Agent[]` - List agents with optional filters
- `updateStatus(agentId: string, status): boolean` - Update agent status

### ResourceManager

- `allocate(resource: Resource): void` - Allocate a resource
- `deallocate(resourceId: string): boolean` - Deallocate a resource
- `get(resourceId: string): Resource | undefined` - Get resource by ID
- `list(filters?): Resource[]` - List resources with optional filters
- `updateStatus(resourceId: string, status): boolean` - Update resource status

### TaskManager

- `create(task: Task): void` - Create a new task
- `delete(taskId: string): boolean` - Delete a task
- `get(taskId: string): Task | undefined` - Get task by ID
- `list(filters?): Task[]` - List tasks with optional filters
- `assign(taskId: string, agentId: string): boolean` - Assign task to agent
- `updateStatus(taskId: string, status): boolean` - Update task status

## License

MIT
