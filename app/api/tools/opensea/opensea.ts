import { NextResponse } from "next/server";

const OPENSEA_API_URL = "https://api.opensea.io/api/v1";

export async function GET(req: Request) {
    const { pathname } = new URL(req.url);
    const pathSegments = pathname.split("/").filter(Boolean);
    
    if (pathSegments[3] === "asset") {
        const assetId = pathSegments[4];
        return await getAssetDetails(assetId);
    } else if (pathSegments[3] === "collection") {
        const collectionSlug = pathSegments[4];
        return await getCollectionDetails(collectionSlug);
    } else if (pathSegments[3] === "offer") {
        const offerData = await req.json();
        return await createOffer(offerData);
    }

    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
}

async function getAssetDetails(assetId: string) {
    const response = await fetch(`${OPENSEA_API_URL}/assets/${assetId}`);
    const data = await response.json();
    return NextResponse.json(data);
}

async function getCollectionDetails(collectionSlug: string) {
    const response = await fetch(`${OPENSEA_API_URL}/collections?slug=${collectionSlug}`);
    const data = await response.json();
    return NextResponse.json(data);
}

async function createOffer(offerData: { assetId: string; price: number; expiration: number }) {
    // Logic to create an offer (this would typically involve a transaction)
    // For now, we will just return the offer data as a placeholder
    return NextResponse.json({
        message: "Offer created",
        offer: offerData,
    });
} 