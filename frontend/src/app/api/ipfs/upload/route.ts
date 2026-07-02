import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/ipfs/upload
 *
 * Proxies file upload to the local IPFS Desktop API.
 * This avoids CORS issues when uploading from the browser.
 */
export async function POST(request: NextRequest) {
  // Only works with local provider
  const provider = process.env.NEXT_PUBLIC_IPFS_PROVIDER ?? "local";
  if (provider !== "local") {
    return NextResponse.json(
      { error: "This endpoint only works with the local IPFS provider" },
      { status: 400 }
    );
  }

  const ipfsApiUrl = process.env.NEXT_PUBLIC_LOCAL_IPFS_API ?? "http://127.0.0.1:5001";

  try {
    const formData = await request.formData();

    const res = await fetch(`${ipfsApiUrl}/api/v0/add`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `IPFS node returned ${res.status}: ${text}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
