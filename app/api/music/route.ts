import { NextResponse } from "next/server";
import { getAlbums } from "@/lib/music";

export const dynamic = "force-dynamic";

export async function GET() {
  const albums = getAlbums();
  return NextResponse.json(albums);
}
