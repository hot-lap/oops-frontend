import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/api/server";

async function handleProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetPath = path.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const fullPath = searchParams ? `${targetPath}?${searchParams}` : targetPath;

  const headers: Record<string, string> = {};
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined;

  const response = await serverFetch(fullPath, {
    method: request.method,
    headers,
    body: body || undefined,
  });

  const responseBody = await response.text();

  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") || "application/json",
    },
  });
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
