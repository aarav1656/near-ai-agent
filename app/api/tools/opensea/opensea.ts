import { NextRequest, NextResponse } from "next/server";
import { getOpenSeaSDK } from "./opensea-utils";
import { parseOrderRequest } from "./parse";
import { orderRequestFlow } from "./order-flow";

export async function GET(req: NextRequest) {
    const { pathname, searchParams } = new URL(req.url);
    const pathSegments = pathname.split("/").filter(Boolean);
    const sdk = getOpenSeaSDK(1);

    try {
        if (pathSegments[3] === "asset") {
            const contract = searchParams.get("contract");
            const tokenId = searchParams.get("tokenId");
            
            if (!contract || !tokenId) {
                return NextResponse.json({ error: "Missing contract or tokenId" }, { status: 400 });
            }

            const asset = await sdk.api.getNFT({ contract, identifier: tokenId });
            return NextResponse.json(asset);

        } else if (pathSegments[3] === "collection") {
            const collectionSlug = pathSegments[4];
            const collection = await sdk.api.getCollection({ slug: collectionSlug });
            return NextResponse.json(collection);
        }

        return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
    } catch (error) {
        console.error("OpenSea API error:", error);
        return NextResponse.json({ error: "OpenSea API error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        if (req.url.endsWith("/offer")) {
            const { chainId, orderRequest } = await parseOrderRequest(req);
            const result = await orderRequestFlow({ chainId, orderRequest });
            return NextResponse.json(result);
        }

        return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
    } catch (error) {
        console.error("OpenSea order error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
} 