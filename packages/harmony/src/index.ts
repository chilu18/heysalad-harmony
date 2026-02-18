/**
 * @heysalad/harmony
 * Resource management for humans and AI agents
 */

// Core types
export interface Agent {
  id: string;
  name: string;
  type: 'human' | 'ai';
  status: 'active' | 'idle' | 'offline';
  capabilities: string[];
  metadata?: Record<string, unknown>;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  owner: string; // Agent ID
  status: 'available' | 'in_use' | 'maintenance';
  metadata?: Record<string, unknown>;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo?: string; // Agent ID
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

// Agent management
export class AgentManager {
  private agents: Map<string, Agent> = new Map();

  register(agent: Agent): void {
    this.agents.set(agent.id, agent);
  }

  unregister(agentId: string): boolean {
    return this.agents.delete(agentId);
  }

  get(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  list(filters?: { type?: 'human' | 'ai'; status?: Agent['status'] }): Agent[] {
    const agents = Array.from(this.agents.values());

    if (!filters) return agents;

    return agents.filter(agent => {
      if (filters.type && agent.type !== filters.type) return false;
      if (filters.status && agent.status !== filters.status) return false;
      return true;
    });
  }

  updateStatus(agentId: string, status: Agent['status']): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    agent.status = status;
    this.agents.set(agentId, agent);
    return true;
  }
}

// Resource management
export class ResourceManager {
  private resources: Map<string, Resource> = new Map();

  allocate(resource: Resource): void {
    this.resources.set(resource.id, resource);
  }

  deallocate(resourceId: string): boolean {
    return this.resources.delete(resourceId);
  }

  get(resourceId: string): Resource | undefined {
    return this.resources.get(resourceId);
  }

  list(filters?: { type?: string; status?: Resource['status']; owner?: string }): Resource[] {
    const resources = Array.from(this.resources.values());

    if (!filters) return resources;

    return resources.filter(resource => {
      if (filters.type && resource.type !== filters.type) return false;
      if (filters.status && resource.status !== filters.status) return false;
      if (filters.owner && resource.owner !== filters.owner) return false;
      return true;
    });
  }

  updateStatus(resourceId: string, status: Resource['status']): boolean {
    const resource = this.resources.get(resourceId);
    if (!resource) return false;

    resource.status = status;
    this.resources.set(resourceId, resource);
    return true;
  }
}

// Task management
export class TaskManager {
  private tasks: Map<string, Task> = new Map();

  create(task: Task): void {
    this.tasks.set(task.id, task);
  }

  delete(taskId: string): boolean {
    return this.tasks.delete(taskId);
  }

  get(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  list(filters?: { assignedTo?: string; status?: Task['status']; priority?: Task['priority'] }): Task[] {
    const tasks = Array.from(this.tasks.values());

    if (!filters) return tasks;

    return tasks.filter(task => {
      if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false;
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      return true;
    });
  }

  assign(taskId: string, agentId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    task.assignedTo = agentId;
    task.updatedAt = new Date();
    this.tasks.set(taskId, task);
    return true;
  }

  updateStatus(taskId: string, status: Task['status']): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    task.status = status;
    task.updatedAt = new Date();
    this.tasks.set(taskId, task);
    return true;
  }
}

// Harmony orchestrator
export class Harmony {
  public agents: AgentManager;
  public resources: ResourceManager;
  public tasks: TaskManager;

  constructor() {
    this.agents = new AgentManager();
    this.resources = new ResourceManager();
    this.tasks = new TaskManager();
  }
}

// Export singleton instance
export const harmony = new Harmony();
