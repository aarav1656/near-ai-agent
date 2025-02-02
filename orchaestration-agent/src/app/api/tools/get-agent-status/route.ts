import { NextResponse } from 'next/server';
import { AgentRegistry } from '../../../utils/agent-registry';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const agentId = searchParams.get('agentId');

        if (!agentId) {
            return NextResponse.json({ 
                error: 'agentId parameter is required' 
            }, { status: 400 });
        }

        const agent = await AgentRegistry.getAgent(agentId);
        if (!agent) {
            return NextResponse.json({ 
                error: `Agent ${agentId} not found` 
            }, { status: 404 });
        }

        return NextResponse.json({
            status: agent.status,
            capabilities: agent.capabilities
        });

    } catch (error: any) {
        console.error('Error getting agent status:', error);
        return NextResponse.json({ 
            error: 'Failed to get agent status',
            details: error.message 
        }, { status: 500 });
    }
} 