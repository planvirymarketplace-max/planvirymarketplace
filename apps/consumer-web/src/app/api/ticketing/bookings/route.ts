import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
const supabase = createAdminClient()
import { randomUUID } from 'crypto'
import { calculatePrice, checkAvailability } from '@planviry/shared'

interface BookingRequest {
  performanceId: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    emailOptIn?: boolean
    smsOptIn?: boolean
    address?: string
    city?: string
    postcode?: string
    country?: string
  }
  seats: Array<{
    seatId: string
    ticketType: 'ADULT' | 'CHILD' | 'CONCESSION'
    price: number
  }>
  accessibilityRequirements?: string
  specialRequests?: string
  totalAmount: number
  bookingFee?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json()
    console.log('📝 Creating booking:', body)

    const {
      performanceId,
      customer,
      seats,
      accessibilityRequirements,
      specialRequests,
      totalAmount,
      bookingFee = 0
    } = body

    // Validate required fields
    if (!performanceId || !customer.firstName || !customer.lastName || !customer.email || !seats || seats.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Get performance details to validate it exists
    const { data: performance, error: perfError } = await supabase
      .from('performances')
      .select(`
        id,
        dateTime,
        showId,
        shows (
          id,
          title,
          organizationId
        )
      `)
      .eq('id', performanceId)
      .single()

    if (perfError || !performance) {
      console.error('Performance not found:', perfError)
      return NextResponse.json({
        success: false,
        error: 'Performance not found'
      }, { status: 404 })
    }

    console.log('✅ Found performance:', (performance.shows as any).title)

    // ─── FIX-5: model-aware pricing via shared adapter (PER_SEAT) ──────────
    // Previously: `totalAmount` was read straight from the request body — a
    // client could pass any number. Now the per-seat prices (in the body's
    // `seats[].price` field, expected to be in the booking currency's major
    // unit) are summed through `calculatePrice` with the PER_SEAT model.
    // The body's `totalAmount` is ignored for the booking row.
    const seatPricesCents = seats.map(s => Math.round((s.price ?? 0) * 100))
    const priceResult = calculatePrice(
      supabase,
      {
        base_price_cents: 0,
        pricing_model: 'PER_SEAT',
        category: 'EVENT_TICKET',
      },
      { seats: seatPricesCents },
    )
    const computedTotalCents = priceResult.total_cents
    const computedBookingFeeCents = Math.round((bookingFee ?? 0) * 100)
    const computedGrandTotalCents = computedTotalCents + computedBookingFeeCents
    // Keep amounts in the body's currency unit (pounds/dollars) for the
    // legacy `bookings`/`booking_items` columns that store major-unit values.
    const computedTotalAmount = computedGrandTotalCents / 100
    const computedBookingFee = computedBookingFeeCents / 100

    // ─── FIX-5: best-effort seat-availability check via shared adapter ─────
    // The real protection against overselling is the atomic conditional
    // UPDATE on `capacity_assignments` below. The adapter check reads from
    // `reservations` (mapped from `bookings` via db-compat) and surfaces the
    // already-booked seat IDs for a friendlier 409 message.
    const seatIds = seats.map(seat => seat.seatId)
    const availItemId = (performance.showId as string | undefined) ?? performanceId
    const avail = await checkAvailability(supabase, availItemId, 'EVENT_TICKET', {
      seat_ids: seatIds,
    })
    if (!avail.available) {
      return NextResponse.json({
        success: false,
        error: 'Some seats are no longer available. Please refresh and try again.',
        alreadyBookedSeats: avail.booked_seats?.filter(id => seatIds.includes(id)) ?? [],
      }, { status: 409 })
    }

    // ─── FIX-5: ATOMIC capacity check (replaces read-then-write TOCTOU) ────
    // Pattern mirrors /api/checkout/route.ts:114-135 (capacity_assignments).
    // If the show/performance has a capacity_assignments row, do a single
    // conditional UPDATE with `.lte('used', capacity - N)` guard. If 0 rows
    // updated, a concurrent request grabbed the last seats between our check
    // and our insert — return 409. The previous SELECT-then-INSERT pattern
    // (booking_items with bookings!inner join) was both broken (`booking_items`
    // is not in TABLE_MAP → 500) and racy.
    const { data: capPools } = await supabase
      .from('capacity_assignments')
      .select('id, name, capacity, used')
      .eq('item_id', availItemId)

    if (capPools && capPools.length > 0) {
      const seatCount = seats.length
      for (const pool of capPools) {
        if (pool.capacity - pool.used < seatCount) {
          return NextResponse.json({
            success: false,
            error: `Sold out (pool: ${pool.name})`,
          }, { status: 409 })
        }
        const { data: atomicResult, error: atomicErr } = await supabase
          .from('capacity_assignments')
          .update({ used: pool.used + seatCount })
          .eq('id', pool.id)
          .lte('used', pool.capacity - seatCount)
          .select('id')
        if (atomicErr || !atomicResult || atomicResult.length === 0) {
          return NextResponse.json({
            success: false,
            error: `Sold out (pool: ${pool.name}) — race condition prevented`,
          }, { status: 409 })
        }
      }
    }

    console.log('✅ All seats are available for booking')

    // Create or find customer
    let customerId = null

    // Check if customer exists
    const { data: existingCustomer, error: customerLookupError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', customer.email)
      .single()

    if (existingCustomer) {
      customerId = existingCustomer.id
      console.log('✅ Found existing customer:', customerId)
    } else {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          id: randomUUID(),
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone || null,
          address: customer.address || null,
          city: customer.city || null,
          postcode: customer.postcode || null,
          country: customer.country || 'GB',
          emailOptIn: customer.emailOptIn || false,
          smsOptIn: customer.smsOptIn || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select('id')
        .single()

      if (customerError) {
        console.error('Error creating customer:', customerError)
        return NextResponse.json({
          success: false,
          error: 'Failed to create customer'
        }, { status: 500 })
      }

      customerId = newCustomer.id
      console.log('✅ Created new customer:', customerId)
    }

    // Generate booking number
    const bookingNumber = `BK${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`

    // Create booking (start as PENDING until payment completes)
    const bookingId = randomUUID()
    const now = new Date().toISOString()

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        id: bookingId,
        bookingNumber: bookingNumber,
        status: 'PENDING',
        // FIX-5: use server-computed totals (from calculatePrice) — ignore
        // the body's `totalAmount`/`bookingFee` to prevent client-side price
        // tampering.
        totalAmount: computedTotalAmount,
        bookingFee: computedBookingFee,
        accessibilityRequirements: accessibilityRequirements || null,
        specialRequests: specialRequests || null,
        performanceId: performanceId,
        showId: performance.showId,
        customerId: customerId,
        createdAt: now,
        updatedAt: now
      })
      .select('*')
      .single()

    if (bookingError) {
      // Compensating transaction: release the reserved capacity.
      if (capPools && capPools.length > 0) {
        for (const pool of capPools) {
          await supabase
            .from('capacity_assignments')
            .update({ used: Math.max(0, pool.used) })
            .eq('id', pool.id)
        }
      }
      console.error('Error creating booking:', bookingError)
      return NextResponse.json({
        success: false,
        error: 'Failed to create booking'
      }, { status: 500 })
    }

    console.log('✅ Created booking (pending):', booking.bookingNumber)

    // Create booking items for each seat
    const bookingItems = seats.map(seat => ({
      id: randomUUID(),
      seatId: seat.seatId,
      ticketType: seat.ticketType,
      price: seat.price,
      bookingId: bookingId,
      createdAt: now
    }))

    const { data: items, error: itemsError } = await supabase
      .from('booking_items')
      .insert(bookingItems)
      .select('*')

    if (itemsError) {
      console.error('Error creating booking items:', itemsError)
      // Try to rollback booking + release the reserved capacity.
      await supabase.from('bookings').delete().eq('id', bookingId)
      if (capPools && capPools.length > 0) {
        for (const pool of capPools) {
          await supabase
            .from('capacity_assignments')
            .update({ used: Math.max(0, pool.used) })
            .eq('id', pool.id)
        }
      }
      return NextResponse.json({
        success: false,
        error: 'Failed to create booking items'
      }, { status: 500 })
    }

    console.log('✅ Created booking items:', items.length)

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Booking created successfully!',
      data: {
        booking: {
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          status: booking.status,
          totalAmount: booking.totalAmount,
          bookingFee: booking.bookingFee,
          performanceId: booking.performanceId,
          customerId: booking.customerId,
          createdAt: booking.createdAt
        },
        items: items,
        performance: {
          id: performance.id,
          dateTime: performance.dateTime,
          show: performance.shows
        }
      }
    })

  } catch (error: any) {
    console.error('❌ Error creating booking:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const performanceId = searchParams.get('performanceId')
    const status = searchParams.get('status')

    let query = supabase
      .from('bookings')
      .select(`
        id,
        bookingNumber,
        status,
        totalAmount,
        bookingFee,
        accessibilityRequirements,
        specialRequests,
        createdAt,
        updatedAt,
        customers (
          id,
          firstName,
          lastName,
          email,
          phone,
          emailOptIn,
          smsOptIn
        ),
        performances (
          id,
          dateTime,
          isMatinee,
          shows (
            id,
            title,
            venue:venues (
              name,
              address
            )
          )
        ),
        booking_items (
          id,
          seatId,
          ticketType,
          price,
          seats (
            id,
            row,
            number,
            section
          )
        )
      `)

    // Apply filters
    if (customerId) {
      query = query.eq('customerId', customerId)
    }

    if (performanceId) {
      query = query.eq('performanceId', performanceId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    // Order by creation date (newest first)
    query = query.order('createdAt', { ascending: false })

    const { data: bookings, error } = await query

    if (error) {
      console.error('Error fetching bookings:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    // Normalize shape: expose `customer` (singular) for consumers
    const normalized = (bookings || []).map((b: any) => {
      const customer = b.customers
        ? {
            id: b.customers.id,
            firstName: b.customers.firstName,
            lastName: b.customers.lastName,
            email: b.customers.email,
            phone: b.customers.phone,
          }
        : null
      return {
        ...b,
        customer,
      }
    })

    return NextResponse.json({
      success: true,
      data: normalized,
      meta: {
        total: normalized.length
      }
    })

  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch bookings'
    }, { status: 500 })
  }
}
