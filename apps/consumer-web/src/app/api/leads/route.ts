import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-marketplace/server'

interface LeadRequestBody {
  vendorId: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  eventType?: string
  eventDate?: string
  guestCount?: number
  budgetMin?: number
  budgetMax?: number
  venueName?: string
  venueCity?: string
  message?: string
  packageId?: string
  source?: string
}

/**
 * POST /api/leads
 *
 * Create a new lead (inquiry) for a vendor.
 * Uses the server client for auth context.
 */
export async function POST(request: Request) {
  try {
    const body: LeadRequestBody = await request.json()

    if (!body.vendorId) {
      return NextResponse.json(
        { error: 'vendorId is required' },
        { status: 400 }
      )
    }

    if (!body.contactName || !body.contactEmail) {
      return NextResponse.json(
        { error: 'contactName and contactEmail are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get the current user ID (optional - leads can be anonymous)
    const { data: { user } } = await supabase.auth.getUser()

    const insertData: Record<string, any> = {
      vendor_id: body.vendorId,
      customer_id: user?.id || null,
      contact_name: body.contactName,
      contact_email: body.contactEmail,
      contact_phone: body.contactPhone || null,
      event_type: body.eventType || null,
      event_date: body.eventDate || null,
      guest_count: body.guestCount || null,
      budget_min: body.budgetMin || null,
      budget_max: body.budgetMax || null,
      venue_name: body.venueName || null,
      venue_city: body.venueCity || null,
      message: body.message || null,
      package_id: body.packageId || null,
      source: body.source || 'profile',
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error (leads):', error)
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      )
    }

    return NextResponse.json({ lead }, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
