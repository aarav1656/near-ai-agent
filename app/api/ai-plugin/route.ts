import { NextResponse } from "next/server";


const key = JSON.parse(process.env.BITTE_KEY || "{}");
const config = JSON.parse(process.env.BITTE_CONFIG || "{}");

if (!key?.accountId) {
    console.error("no account");
}

const serverUrl = config.url || "http://localhost:3000";

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "Near AI Agent",
            description: "API for the Near AI Agent",
            version: "1.0.0",
        },
        servers: [
            {
                url: serverUrl,
            },
        ],
        "x-mb": {
            "account-id": key.accountId,
            assistant: {
                name: "MultiChain AI Assistant",
                description: "MultiChain AI Assistant",
                instructions: "You answer with a list of blockchains. Use the tools to get blockchain information.",
                tools: [{ type: "generate-transaction" }]
            },
        },
        paths: {
            "/api/tools/get-blockchains": {
                get: {
                    summary: "get blockchain information",
                    description: "Respond with a list of blockchains",
                    operationId: "get-blockchains",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            message: {
                                                type: "string",
                                                description: "The list of blockchains",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/get-user": {
                get: {
                    summary: "get user information",
                    description: "Respond with user account ID",
                    operationId: "get-user",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            accountId: {
                                                type: "string",
                                                description: "The user's account ID",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/twitter": {
                get: {
                    operationId: "getTwitterShareIntent",
                    summary: "Generate a Twitter share intent URL",
                    description: "Creates a Twitter share intent URL based on provided parameters",
                    parameters: [
                        {
                            name: "text",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The text content of the tweet"
                        },
                        {
                            name: "url",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The URL to be shared in the tweet"
                        },
                        {
                            name: "hashtags",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Comma-separated hashtags for the tweet"
                        },
                        {
                            name: "via",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The Twitter username to attribute the tweet to"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            twitterIntentUrl: {
                                                type: "string",
                                                description: "The generated Twitter share intent URL"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/create-transaction": {
                get: {
                    operationId: "createNearTransaction",
                    summary: "Create a NEAR transaction payload",
                    description: "Generates a NEAR transaction payload for transferring tokens",
                    parameters: [
                        {
                            name: "receiverId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The NEAR account ID of the receiver"
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The amount of NEAR tokens to transfer"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The receiver's NEAR account ID"
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description: "The type of action (e.g., 'Transfer')"
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        deposit: {
                                                                            type: "string",
                                                                            description: "The amount to transfer in yoctoNEAR"
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
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/derivebitcointxn": {
                get: {
                    operationId: "deriveBitcoinTransaction",
                    summary: "Derive Bitcoin address and get balance",
                    description: "Derives a Bitcoin address from a path and returns the address with its balance",
                    parameters: [
                        {
                            name: "path",
                            in: "query",
                            description: "Derivation path for the Bitcoin address",
                            required: true,
                            schema: {
                                type: "string"
                            }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            derivedAddress: {
                                                type: "string",
                                                description: "The derived Bitcoin address"
                                            },
                                            balance: {
                                                type: "number",
                                                description: "Balance of the derived address in BTC"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/buildbitcointxn": {
                get: {
                    operationId: "buildBitcoinTransaction",
                    summary: "Build a Bitcoin transaction",
                    description: "Creates a Bitcoin transaction payload based on the provided parameters.",
                    parameters: [
                        {
                            name: "path",
                            in: "query",
                            description: "Derivation path for the Bitcoin address",
                            required: true,
                            schema: {
                                type: "string"
                            }
                        },
                        {
                            name: "to",
                            in: "query",
                            description: "Recipient Bitcoin address",
                            required: true,
                            schema: {
                                type: "string"
                            }
                        },
                        {
                            name: "amount",
                            in: "query",
                            description: "Amount of Bitcoin to send (in BTC)",
                            required: true,
                            schema: {
                                type: "string"
                            }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            fromAddress: {
                                                type: "string",
                                                description: "Sender's Bitcoin address"
                                            },
                                            to: {
                                                type: "string",
                                                description: "Recipient's Bitcoin address"
                                            },
                                            amount: {
                                                type: "string",
                                                description: "Amount of Bitcoin to send (in BTC)"
                                            },
                                            txPayload: {
                                                type: "object",
                                                description: "Bitcoin transaction payload"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/signbitcointxn": {
                post: {
                    summary: "Sign a Bitcoin transaction",
                    description: "Sign a Bitcoin transaction using MPC through NEAR wallet",
                    operationId: "signbitcointxn",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["path", "unsignedTx", "publicKey"],
                                    properties: {
                                        path: {
                                            type: "string", 
                                            description: "Derivation path for the Bitcoin address"
                                        },
                                        unsignedTx: {
                                            type: "string",
                                            description: "Unsigned Bitcoin transaction hex"
                                        },
                                        publicKey: {
                                            type: "string",
                                            description: "Public key in hex format"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        "200": {
                            description: "Successfully signed transaction",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if signing was successful"
                                            },
                                            signedTransaction: {
                                                type: "string",
                                                description: "Signed transaction hex"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            },
                                            details: {
                                                type: "string",
                                                description: "Detailed error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/deriveethtxn": {
                get: {
                    summary: "Derive Ethereum address and get balance",
                    description: "Derives an Ethereum address from a path and returns its balance",
                    operationId: "deriveethtxn",
                    parameters: [
                        {
                            name: "path",
                            in: "query", 
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Derivation path for the Ethereum address"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            derivedAddress: {
                                                type: "string",
                                                description: "The derived Ethereum address"
                                            },
                                            publicKey: {
                                                type: "string",
                                                description: "The public key in hex format"
                                            },
                                            balance: {
                                                type: "string",
                                                description: "Balance in ETH"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            },
                                            details: {
                                                type: "string",
                                                description: "Detailed error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/buildeth": {
                get: {
                    summary: "Build and execute Ethereum transaction",
                    description: "Create and execute an Ethereum transaction",
                    operationId: "buildeth",
                    parameters: [
                        {
                            name: "sender",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Sender's Ethereum address"
                        },
                        {
                            name: "receiver",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Receiver's Ethereum address"
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Amount of Ether to send"
                        },
                        {
                            name: "data",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Additional data for the transaction (optional)"
                        },
                        {
                            name: "accountId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "NEAR account ID"
                        },
                        {
                            name: "path",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Derivation path (optional)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            txHash: {
                                                type: "string",
                                                description: "Transaction hash of the executed Ethereum transaction"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/health": {
                get: {
                  tags: ["health"],
                  summary: "Confirms server running",
                  description: "Test Endpoint to confirm system is running",
                  operationId: "check-health",
                  parameters: [],
                  responses: {
                    "200": {
                      description: "Ok Message",
                      content: {
                        "application/json": {
                          schema: {
                            type: "object",
                            properties: {
                              message: {
                                type: "string",
                                description: "Ok Message",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
            },
            "/api/tools/uniswap": {
                post: {
                  tags: ["uniswap"],
                  operationId: "swap",
                  summary:
                    "Quote a price and fee for the specified order parameters. Posts unsigned order to Uniswap and returns Signable payload",
                  description:
                    "Given a partial order compute the minimum fee and a price estimate for the order. Return a full order that can be used directly for signing, and with an included signature, passed directly to the order creation endpoint.",
                  parameters: [
                    { $ref: "#/components/parameters/chainId" },
                    { $ref: "#/components/parameters/safeAddress" },
                    {
                      in: "query",
                      name: "sellToken",
                      required: true,
                      schema: {
                        type: "string",
                      },
                      description:
                        "The ERC-20 token symbol or address to be sold, if provided with the symbol do not try to infer the address.",
                    },
                    {
                      in: "query",
                      name: "buyToken",
                      required: true,
                      schema: {
                        type: "string",
                      },
                      description:
                        "The ERC-20 token symbol or address to be bought, if provided with the symbol do not try to infer the address..",
                    },
                    {
                      in: "query",
                      name: "receiver",
                      required: false,
                      schema: {
                        type: "string",
                      },
                      description:
                        "The address to receive the proceeds of the trade, instead of the sender's address.",
                    },
                    {
                      in: "query",
                      name: "sellAmountBeforeFee",
                      required: true,
                      schema: {
                        type: "string",
                      },
                      description:
                        "The amount of tokens to sell before fees, represented as a decimal string in token units. Not Atoms.",
                    },
                  ],
                  // requestBody: {
                  //   description: "The order parameters to compute a quote for.",
                  //   required: true,
                  //   content: {
                  //     "application/json": {
                  //       schema: {
                  //         $ref: "#/components/schemas/OrderQuoteRequest",
                  //       },
                  //     },
                  //   },
                  // },
                  responses: {
                    "200": { $ref: "#/components/responses/SignRequestResponse200" },
                    "400": {
                      description: "Error quoting order.",
                      content: {
                        "application/json": {
                          schema: {
                            $ref: "#/components/schemas/PriceEstimationError",
                          },
                        },
                      },
                    },
                    "404": {
                      description: "No route was found for the specified order.",
                    },
                    "429": {
                      description: "Too many order quotes.",
                    },
                    "500": {
                      description: "Unexpected error quoting an order.",
                    },
                  },
                },
            },
        },
    };

    return NextResponse.json(pluginData);
}