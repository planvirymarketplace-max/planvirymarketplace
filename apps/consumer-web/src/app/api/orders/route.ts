import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Orders API - return empty (no Order model in current schema)
  return NextResponse.json({ orders: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
