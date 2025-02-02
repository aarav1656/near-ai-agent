import { NextResponse } from 'next/server';
import { AgentRegistry } from '../../../../../../app/utils/agent-registry';

export async function POST(request: Request) {
    try {
        const { agentId, task, context } = await request.json();
        
        // Get agent from registry
        const agent = await AgentRegistry.getAgent(agentId);
        if (!agent) {
            return NextResponse.json({ 
                error: `Agent ${agentId} not found` 
            }, { status: 404 });
        }

        // Check if agent can handle task
        if (!agent.canHandle(task)) {
            return NextResponse.json({
                error: `Agent ${agentId} cannot handle this task type`
            }, { status: 400 });
        }

        // Delegate task to agent
        const taskId = await agent.delegateTask(task, context);

        return NextResponse.json({
            taskId,
            status: 'delegated'
        });

    } catch (error: any) {
        console.error('Error delegating task:', error);
        return NextResponse.json({ 
            error: 'Failed to delegate task',
            details: error.message 
        }, { status: 500 });
    }
} 