export interface Agent {
    id: string;
    name: string;
    status: 'available' | 'busy' | 'offline';
    capabilities: string[];
    canHandle: (task: string) => boolean;
    delegateTask: (task: string, context?: any) => Promise<string>;
}

export class AgentRegistry {
    private static agents: Map<string, Agent> = new Map();

    static async initialize() {
        // Register built-in agents
        this.registerAgent({
            id: 'blockchain-agent',
            name: 'Blockchain Expert',
            status: 'available',
            capabilities: ['transaction-creation', 'blockchain-query', 'wallet-integration'],
            canHandle: (task) => {
                const blockchainKeywords = ['transaction', 'blockchain', 'wallet', 'crypto'];
                return blockchainKeywords.some(keyword => task.toLowerCase().includes(keyword));
            },
            delegateTask: async (task, context) => {
                // Implementation for blockchain tasks
                const taskId = `task-${Date.now()}`;
                // Handle blockchain specific logic
                return taskId;
            }
        });

        this.registerAgent({
            id: 'research-agent',
            name: 'Research Assistant',
            status: 'available',
            capabilities: ['data-analysis', 'market-research', 'trend-analysis'],
            canHandle: (task) => {
                const researchKeywords = ['research', 'analyze', 'study', 'investigate'];
                return researchKeywords.some(keyword => task.toLowerCase().includes(keyword));
            },
            delegateTask: async (task, context) => {
                // Implementation for research tasks
                const taskId = `task-${Date.now()}`;
                // Handle research specific logic
                return taskId;
            }
        });

        this.registerAgent({
            id: 'code-agent',
            name: 'Code Assistant',
            status: 'available',
            capabilities: ['code-generation', 'code-review', 'debugging'],
            canHandle: (task) => {
                const codeKeywords = ['code', 'program', 'function', 'debug'];
                return codeKeywords.some(keyword => task.toLowerCase().includes(keyword));
            },
            delegateTask: async (task, context) => {
                // Implementation for coding tasks
                const taskId = `task-${Date.now()}`;
                // Handle coding specific logic
                return taskId;
            }
        });
    }

    static registerAgent(agent: Agent) {
        this.agents.set(agent.id, agent);
    }

    static async getAgent(agentId: string): Promise<Agent | undefined> {
        return this.agents.get(agentId);
    }

    static async findSuitableAgent(task: string): Promise<Agent | undefined> {
        for (const agent of this.agents.values()) {
            if (agent.status === 'available' && agent.canHandle(task)) {
                return agent;
            }
        }
        return undefined;
    }
}

// Initialize registry when module loads
AgentRegistry.initialize(); 