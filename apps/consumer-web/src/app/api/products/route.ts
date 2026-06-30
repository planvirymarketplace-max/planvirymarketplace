import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Products API - return empty (no Product model in current schema)
  return NextResponse.json({ products: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
