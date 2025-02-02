import { NextResponse } from "next/server";

const key = JSON.parse(process.env.BITTE_KEY || "{}");
const config = JSON.parse(process.env.BITTE_CONFIG || "{}");
const serverUrl = config.url || "http://localhost:3000";

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "Multi-Agent Orchestrator",
            description: "Primary agent that coordinates specialized agents for complex tasks",
            version: "1.0.0",
        },
        servers: [{ url: serverUrl }],
        "x-mb": {
            "account-id": key.accountId,
            assistant: {
                name: "Orchestrator Agent",
                description: "Primary agent that coordinates other specialized agents",
                instructions: `You are an orchestrator agent that can delegate tasks to specialized agents.
                Available agents:
                - blockchain-agent: Handles blockchain transactions and queries
                - research-agent: Performs data analysis and research
                - code-agent: Handles code generation and review
                
                When a task requires multiple capabilities, break it down and delegate to appropriate agents.
                Use @agent-name syntax to delegate tasks.`,
                tools: [
                    { type: "delegate-task" },
                    { type: "get-agent-status" },
                    { type: "generate-transaction" }
                ]
            },
        },
        paths: {
            "/api/tools/delegate-task": {
                post: {
                    summary: "Delegate a task to another agent",
                    operationId: "delegate-task",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        agentId: {
                                            type: "string",
                                            description: "ID of agent to delegate to"
                                        },
                                        task: {
                                            type: "string",
                                            description: "Task description"
                                        },
                                        context: {
                                            type: "object",
                                            description: "Additional context"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        "200": {
                            description: "Task delegated successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            taskId: { type: "string" },
                                            status: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/get-agent-status": {
                get: {
                    summary: "Get status of an agent",
                    operationId: "get-agent-status", 
                    parameters: [{
                        name: "agentId",
                        in: "query",
                        required: true,
                        schema: { type: "string" }
                    }],
                    responses: {
                        "200": {
                            description: "Agent status retrieved",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            status: { type: "string" },
                                            capabilities: { 
                                                type: "array",
                                                items: { type: "string" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    return NextResponse.json(pluginData);
}