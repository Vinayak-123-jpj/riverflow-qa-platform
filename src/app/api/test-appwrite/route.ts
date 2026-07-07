import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_HOST_URL;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;
    
    const logs: string[] = [];
    logs.push(`=== Appwrite Environment Variables Test ===`);
    logs.push(`Endpoint: ${endpoint}`);
    logs.push(`Project ID: ${projectId}`);
    logs.push(`API Key: ${apiKey ? 'Set (length: ' + apiKey.length + ')' : 'Not set'}`);
    
    if (!endpoint || !projectId || !apiKey) {
        logs.push("ERROR: Missing environment variables");
        return NextResponse.json({ success: false, logs }, { status: 500 });
    }

    logs.push("✓ All environment variables are set");
    logs.push("=== Test Complete ===");
    return NextResponse.json({ success: true, logs });
}
