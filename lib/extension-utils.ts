import { NextResponse } from "next/server";

/**
 * Adds CORS headers to a response to allow communication from the Chrome Extension.
 */
export function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // In production, restrict this to your extension ID
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

/**
 * Handles OPTIONS preflight requests for the extension.
 */
export function handleOptions() {
  const response = new NextResponse(null, { status: 204 });
  return withCors(response);
}
