import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createHmac } from 'crypto'

// POST /api/attendees/resend?reservation_id= — vendor/admin resends ticket email
// Re-export of self-service/resend but with vendor authorization check.
export { POST } from '../self-service/resend/route'
