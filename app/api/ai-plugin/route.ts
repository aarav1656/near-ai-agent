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
            "/api/tools/opensea/asset/{assetId}": {
                get: {
                    summary: "Get Asset Details",
                    description: "Fetch details about a specific asset.",
                    parameters: [
                        {
                            name: "assetId",
                            in: "path",
                            required: true,
                            description: "The ID of the asset to fetch.",
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            // Define the asset properties here
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/opensea/collection/{collectionSlug}": {
                get: {
                    summary: "Get Collection Details",
                    description: "Fetch details about a specific collection.",
                    parameters: [
                        {
                            name: "collectionSlug",
                            in: "path",
                            required: true,
                            description: "The slug of the collection to fetch.",
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            // Define the collection properties here
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/opensea/offer": {
                post: {
                    summary: "Create an Offer",
                    description: "Create an offer for an asset.",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        assetId: {
                                            type: "string",
                                            description: "The ID of the asset to offer.",
                                        },
                                        price: {
                                            type: "number",
                                            description: "The price of the offer.",
                                        },
                                        expiration: {
                                            type: "number",
                                            description: "The expiration time of the offer.",
                                        },
                                    },
                                    required: ["assetId", "price", "expiration"],
                                },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Successful offer creation",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            message: {
                                                type: "string",
                                            },
                                            offer: {
                                                type: "object",
                                                properties: {
                                                    assetId: { type: "string" },
                                                    price: { type: "number" },
                                                    expiration: { type: "number" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        components: {
            parameters: {
              chainId: {
                name: "chainId",
                in: "query",
                description:
                  "EVM Network on which to assests live and transactions are to be constructed",
                required: true,
                schema: {
                  type: "number",
                },
                example: 100,
              },
              amount: {
                name: "amount",
                in: "query",
                description: "amount in Units",
                required: true,
                schema: {
                  type: "number",
                },
                example: 0.123,
              },
              address: {
                name: "address",
                in: "query",
                description:
                  "20 byte Ethereum address encoded as a hex with `0x` prefix.",
                required: true,
                schema: {
                  type: "string",
                },
                example: "0x6810e776880c02933d47db1b9fc05908e5386b96",
              },
              safeAddress: {
                name: "safeAddress",
                in: "query",
                required: true,
                description: "The Safe address (i.e. the connected user address)",
                schema: {
                  $ref: "#/components/schemas/Address",
                },
              },
              recipient: {
                name: "recipient",
                in: "query",
                required: true,
                description: "Recipient address of the transferred token.",
                schema: {
                  $ref: "#/components/schemas/Address",
                },
              },
              token: {
                name: "token",
                in: "query",
                description: "Token address to be transferred.",
                schema: {
                  $ref: "#/components/schemas/Address",
                },
              },
            },
            responses: {
              SignRequest200: {
                description: "Generic Structure representing an EVM Signature Request",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/SignRequest",
                    },
                  },
                },
              },
              SignRequestResponse200: {
                description:
                  "Uniswap Fusion order response including transaction and order URL",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        transaction: {
                          $ref: "#/components/schemas/SignRequest",
                        },
                        meta: {
                          type: "object",
                          description: "Additional metadata related to the transaction",
                          additionalProperties: true,
                          example: {
                            message: "Order submitted successfully",
                          },
                        },
                      },
                      required: ["transaction"],
                    },
                  },
                },
              },
              BadRequest400: {
                description: "Bad Request - Invalid or missing parameters",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        ok: {
                          type: "boolean",
                          example: false,
                        },
                        message: {
                          type: "string",
                          example: "Missing required parameters: chainId or amount",
                        },
                      },
                    },
                  },
                },
              },
            },
            schemas: {
              Address: {
                description:
                  "20 byte Ethereum address encoded as a hex with `0x` prefix.",
                type: "string",
                example: "0x6810e776880c02933d47db1b9fc05908e5386b96",
              },
              SignRequest: {
                type: "object",
                required: ["method", "chainId", "params"],
                properties: {
                  method: {
                    type: "string",
                    enum: [
                      "eth_sign",
                      "personal_sign",
                      "eth_sendTransaction",
                      "eth_signTypedData",
                      "eth_signTypedData_v4",
                    ],
                    description: "The signing method to be used.",
                    example: "eth_sendTransaction",
                  },
                  chainId: {
                    type: "integer",
                    description:
                      "The ID of the Ethereum chain where the transaction or signing is taking place.",
                    example: 100,
                  },
                  params: {
                    oneOf: [
                      {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/MetaTransaction",
                        },
                        description: "An array of Ethereum transaction parameters.",
                      },
                      {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description: "Parameters for personal_sign request",
                        example: [
                          "0x4578616d706c65206d657373616765",
                          "0x0000000000000000000000000000000000000001",
                        ],
                      },
                      {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description: "Parameters for eth_sign request",
                        example: [
                          "0x0000000000000000000000000000000000000001",
                          "0x4578616d706c65206d657373616765",
                        ],
                      },
                      {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Parameters for signing structured data (TypedDataParams)",
                        example: [
                          "0x0000000000000000000000000000000000000001",
                          '{"data": {"types": {"EIP712Domain": [{"name": "name","type": "string"}]}}}',
                        ],
                      },
                    ],
                  },
                },
              },
              MetaTransaction: {
                description: "Sufficient data representing an EVM transaction",
                type: "object",
                properties: {
                  to: {
                    $ref: "#/components/schemas/Address",
                    description: "Recipient address",
                  },
                  data: {
                    type: "string",
                    description: "Transaction calldata",
                    example: "0xd0e30db0",
                  },
                  value: {
                    type: "string",
                    description: "Transaction value",
                    example: "0x1b4fbd92b5f8000",
                  },
                },
                required: ["to", "data", "value"],
              },
              SellTokenSource: {
                description: "Where should the `sellToken` be drawn from?",
                type: "string",
                enum: ["erc20", "internal", "external"],
              },
              BuyTokenDestination: {
                description: "Where should the `buyToken` be transferred to?",
                type: "string",
                enum: ["erc20", "internal"],
              },
              PriceQuality: {
                description:
                  "How good should the price estimate be?\n\nFast: The price estimate is chosen among the fastest N price estimates.\nOptimal: The price estimate is chosen among all price estimates.\nVerified: The price estimate is chosen among all verified/simulated price estimates.\n\n**NOTE**: Orders are supposed to be created from `verified` or `optimal` price estimates.",
                type: "string",
                enum: ["fast", "optimal", "verified"],
              },
              SigningScheme: {
                description: "How was the order signed?",
                type: "string",
                enum: ["eip712", "ethsign", "presign", "eip1271"],
              },
              EcdsaSigningScheme: {
                description: "How was the order signed?",
                type: "string",
                enum: ["eip712", "ethsign"],
              },
              Signature: {
                description: "A signature.",
                oneOf: [
                  { $ref: "#/components/schemas/EcdsaSignature" },
                  { $ref: "#/components/schemas/PreSignature" },
                ],
              },
              EcdsaSignature: {
                description:
                  "65 bytes encoded as hex with `0x` prefix. `r || s || v` from the spec.",
                type: "string",
                example:
                  "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
              },
              PreSignature: {
                description: 'Empty signature bytes. Used for "presign" signatures.',
                type: "string",
                example: "0x",
              },
              OrderQuoteRequest: {
                description: "Request fee and price quote.",
                allOf: [
                  { $ref: "#/components/schemas/OrderQuoteSide" },
                  { $ref: "#/components/schemas/OrderQuoteValidity" },
                  {
                    type: "object",
                    properties: {
                      sellToken: {
                        description: "ERC-20 token to be sold",
                        allOf: [{ $ref: "#/components/schemas/Address" }],
                      },
                      buyToken: {
                        description: "ERC-20 token to be bought",
                        allOf: [{ $ref: "#/components/schemas/Address" }],
                      },
                      receiver: {
                        description:
                          "An optional address to receive the proceeds of the trade instead of the `owner` (i.e. the order signer).",
                        allOf: [{ $ref: "#/components/schemas/Address" }],
                        nullable: true,
                      },
                      sellTokenBalance: {
                        allOf: [{ $ref: "#/components/schemas/SellTokenSource" }],
                        default: "erc20",
                      },
                      buyTokenBalance: {
                        allOf: [{ $ref: "#/components/schemas/BuyTokenDestination" }],
                        default: "erc20",
                      },
                      from: { $ref: "#/components/schemas/Address" },
                      priceQuality: {
                        allOf: [{ $ref: "#/components/schemas/PriceQuality" }],
                        default: "verified",
                      },
                      signingScheme: {
                        allOf: [{ $ref: "#/components/schemas/SigningScheme" }],
                        default: "eip712",
                      },
                      onchainOrder: {
                        description:
                          "Flag to signal whether the order is intended for on-chain order placement. Only valid for non ECDSA-signed orders.",
                        default: false,
                      },
                      network: {
                        description: "The network on which the order is to be placed.",
                        type: "string",
                        enum: ["mainnet", "xdai", "arbitrum_one" , "polygon"],
                      },
                    },
                    required: ["sellToken", "buyToken", "from"],
                  },
                ],
              },
              OrderQuoteResponse: {
                description:
                  "An order quoted by the backend that can be directly signed and submitted to the order creation backend.",
                type: "object",
                properties: {
                  quote: { $ref: "#/components/schemas/OrderParameters" },
                  from: { $ref: "#/components/schemas/Address" },
                  expiration: {
                    description:
                      "Expiration date of the offered fee. Order service might not accept the fee after this expiration date. Encoded as ISO 8601 UTC.",
                    type: "string",
                    example: "1985-03-10T18:35:18.814523Z",
                  },
                  id: {
                    description:
                      "Quote ID linked to a quote to enable providing more metadata when analysing order slippage.",
                    type: "integer",
                  },
                  verified: {
                    description:
                      "Whether it was possible to verify that the quoted amounts are accurate using a simulation.",
                    type: "boolean",
                  },
                },
                required: ["quote", "expiration", "verified"],
              },
              PriceEstimationError: {
                type: "object",
                properties: {
                  errorType: {
                    type: "string",
                    enum: [
                      "QuoteNotVerified",
                      "UnsupportedToken",
                      "ZeroAmount",
                      "UnsupportedOrderType",
                    ],
                  },
                  description: { type: "string" },
                },
                required: ["errorType", "description"],
              },
              OrderKind: {
                description: "Is this order a buy or sell?",
                type: "string",
                enum: ["buy", "sell"],
              },
              OrderParameters: {
                description: "Order parameters.",
                type: "object",
                properties: {
                  sellToken: {
                    description: "ERC-20 token to be sold.",
                    allOf: [{ $ref: "#/components/schemas/Address" }],
                  },
                  buyToken: {
                    description: "ERC-20 token to be bought.",
                    allOf: [{ $ref: "#/components/schemas/Address" }],
                  },
                  receiver: {
                    description:
                      "An optional Ethereum address to receive the proceeds of the trade instead of the owner (i.e. the order signer).",
                    allOf: [{ $ref: "#/components/schemas/Address" }],
                    nullable: true,
                  },
                  sellAmount: {
                    description: "Amount of `sellToken` to be sold in atoms.",
                    allOf: [{ $ref: "#/components/schemas/TokenAmount" }],
                  },
                  buyAmount: {
                    description: "Amount of `buyToken` to be bought in atoms.",
                    allOf: [{ $ref: "#/components/schemas/TokenAmount" }],
                  },
                  validTo: {
                    description:
                      "Unix timestamp (`uint32`) until which the order is valid.",
                    type: "integer",
                  },
                  feeAmount: {
                    description: "feeRatio * sellAmount + minimal_fee in atoms.",
                    allOf: [{ $ref: "#/components/schemas/TokenAmount" }],
                  },
                  kind: {
                    description: "The kind is either a buy or sell order.",
                    allOf: [{ $ref: "#/components/schemas/OrderKind" }],
                  },
                  partiallyFillable: {
                    description: "Is the order fill-or-kill or partially fillable?",
                    type: "boolean",
                  },
                  sellTokenBalance: {
                    allOf: [{ $ref: "#/components/schemas/SellTokenSource" }],
                    default: "erc20",
                  },
                  buyTokenBalance: {
                    allOf: [{ $ref: "#/components/schemas/BuyTokenDestination" }],
                    default: "erc20",
                  },
                  signingScheme: {
                    allOf: [{ $ref: "#/components/schemas/SigningScheme" }],
                    default: "eip712",
                  },
                },
                required: [
                  "sellToken",
                  "buyToken",
                  "sellAmount",
                  "buyAmount",
                  "validTo",
                  "appData",
                  "feeAmount",
                  "kind",
                  "partiallyFillable",
                ],
              },
              OrderQuoteSide: {
                description: "The buy or sell side when quoting an order.",
                oneOf: [
                  {
                    type: "object",
                    description:
                      "Quote a sell order given the final total `sellAmount` including fees.",
                    properties: {
                      kind: {
                        allOf: [
                          {
                            $ref: "#/components/schemas/OrderQuoteSideKindSell",
                          },
                        ],
                      },
                      sellAmountBeforeFee: {
                        description:
                          "The total amount that is available for the order. From this value, the fee is deducted and the buy amount is calculated.",
                        allOf: [
                          {
                            $ref: "#/components/schemas/TokenAmount",
                          },
                        ],
                      },
                    },
                    required: ["kind", "sellAmountBeforeFee"],
                  },
                  {
                    type: "object",
                    description: "Quote a sell order given the `sellAmount`.",
                    properties: {
                      kind: {
                        allOf: [
                          {
                            $ref: "#/components/schemas/OrderQuoteSideKindSell",
                          },
                        ],
                      },
                      sellAmountAfterFee: {
                        description: "The `sellAmount` for the order.",
                        allOf: [
                          {
                            $ref: "#/components/schemas/TokenAmount",
                          },
                        ],
                      },
                    },
                    required: ["kind", "sellAmountAfterFee"],
                  },
                  {
                    type: "object",
                    description: "Quote a buy order given an exact `buyAmount`.",
                    properties: {
                      kind: {
                        allOf: [
                          {
                            $ref: "#/components/schemas/OrderQuoteSideKindBuy",
                          },
                        ],
                      },
                      buyAmountAfterFee: {
                        description: "The `buyAmount` for the order.",
                        allOf: [
                          {
                            $ref: "#/components/schemas/TokenAmount",
                          },
                        ],
                      },
                    },
                    required: ["kind", "buyAmountAfterFee"],
                  },
                ],
              },
              OrderQuoteSideKindSell: {
                type: "string",
                enum: ["sell"],
              },
              OrderQuoteSideKindBuy: {
                type: "string",
                enum: ["buy"],
              },
              TokenAmount: {
                description: "Amount of a token. `uint256` encoded in decimal.",
                type: "string",
                example: "1234567890",
              },
              OrderQuoteValidity: {
                description: "The validity for the order.",
                oneOf: [
                  {
                    type: "object",
                    description: "Absolute validity.",
                    properties: {
                      validTo: {
                        description:
                          "Unix timestamp (`uint32`) until which the order is valid.",
                        type: "integer",
                      },
                    },
                  },
                  {
                    type: "object",
                    description: "Relative validity",
                    properties: {
                      validFor: {
                        description:
                          "Number (`uint32`) of seconds that the order should be valid for.",
                        type: "integer",
                      },
                    },
                  },
                ],
              },
            },
        },
    };

    return NextResponse.json(pluginData);
}