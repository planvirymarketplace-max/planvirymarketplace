import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import PDFDocument from 'pdfkit'

// GET /api/orders/[id]/invoice — generate + download PDF invoice
// Adapted from Hi.Events: GetOrderInvoiceHandler, InvoiceCreateService
// Uses pdfkit to generate a real PDF file.

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id: reservationId } = await params

  const { data: reservation, error } = await supabase
    .from('reservations')
    .select(`
      id, status, quantity, unit_price_cents, total_price_cents, currency,
      created_at, confirmed_at, cancelled_at, stripe_payment_intent_id,
      stripe_refund_id, refund_amount_cents,
      inventory_items!inner(id, title, category, vendor_accounts!inner(id, name, email, address)),
      user_profiles!inner(display_name, email)
    `)
    .eq('id', reservationId)
    .maybeSingle()

  if (error || !reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })

  // RLS
  if (reservation.user_id !== user.id && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const inv = Array.isArray(reservation.inventory_items) ? reservation.inventory_items[0] : reservation.inventory_items
  const vendor = Array.isArray(inv?.vendor_accounts) ? inv?.vendor_accounts[0] : inv?.vendor_accounts
  const profile = Array.isArray(reservation.user_profiles) ? reservation.user_profiles[0] : reservation.user_profiles

  const invoiceNumber = `INV-${reservationId.slice(0, 8).toUpperCase()}`
  const invoiceDate = (reservation.confirmed_at ?? reservation.created_at)?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)

  // Generate PDF
  const doc = new PDFDocument({ margin: 50, size: 'A4' })
  const chunks: Buffer[] = []
  doc.on('data', (chunk: Buffer) => chunks.push(chunk))

  // Header
  doc.fontSize(24).font('Helvetica-Bold').text('PLANVIRY', { align: 'right' })
  doc.fontSize(10).font('Helvetica').text('Invoice', { align: 'right' })
  doc.moveDown()

  // Invoice metadata
  doc.fontSize(10)
  doc.text(`Invoice Number: ${invoiceNumber}`)
  doc.text(`Invoice Date: ${invoiceDate}`)
  doc.text(`Status: ${reservation.status}`)
  doc.text(`Reservation ID: ${reservationId}`)
  doc.moveDown()

  // Seller
  doc.font('Helvetica-Bold').text('From:')
  doc.font('Helvetica').text(vendor?.name ?? 'N/A')
  doc.text(vendor?.email ?? '')
  doc.text(vendor?.address ?? '')
  doc.moveDown()

  // Buyer
  doc.font('Helvetica-Bold').text('Bill To:')
  doc.font('Helvetica').text(profile?.display_name ?? 'N/A')
  doc.text(profile?.email ?? '')
  doc.moveDown()

  // Line items table
  doc.font('Helvetica-Bold').text('Description')
  doc.moveUp()
  doc.text('Qty', 350, doc.y, { width: 50, align: 'right' })
  doc.text('Unit Price', 400, doc.y, { width: 80, align: 'right' })
  doc.text('Total', 480, doc.y, { width: 70, align: 'right' })
  doc.moveDown()
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
  doc.moveDown(0.5)

  doc.font('Helvetica')
  doc.text(inv?.title ?? 'Item')
  doc.moveUp()
  doc.text(String(reservation.quantity), 350, doc.y, { width: 50, align: 'right' })
  doc.text(`$${((reservation.unit_price_cents ?? 0) / 100).toFixed(2)}`, 400, doc.y, { width: 80, align: 'right' })
  doc.text(`$${((reservation.total_price_cents ?? 0) / 100).toFixed(2)}`, 480, doc.y, { width: 70, align: 'right' })
  doc.moveDown()
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
  doc.moveDown()

  // Totals
  doc.font('Helvetica-Bold').text('Subtotal:', 400, doc.y, { width: 80, align: 'right' })
  doc.text(`$${((reservation.total_price_cents ?? 0) / 100).toFixed(2)}`, 480, doc.y, { width: 70, align: 'right' })
  doc.moveUp()

  if ((reservation.refund_amount_cents ?? 0) > 0) {
    doc.font('Helvetica').text('Refund:', 400, doc.y, { width: 80, align: 'right' })
    doc.text(`-$${((reservation.refund_amount_cents ?? 0) / 100).toFixed(2)}`, 480, doc.y, { width: 70, align: 'right' })
    doc.moveUp()
  }

  doc.font('Helvetica-Bold').text('Total:', 400, doc.y, { width: 80, align: 'right' })
  doc.text(`$${((reservation.total_price_cents ?? 0) - (reservation.refund_amount_cents ?? 0) / 100).toFixed(2)}`, 480, doc.y, { width: 70, align: 'right' })
  doc.moveDown(2)

  // Payment info
  doc.font('Helvetica').fontSize(8)
  if (reservation.stripe_payment_intent_id) {
    doc.text(`Payment Intent: ${reservation.stripe_payment_intent_id}`)
  }
  if (reservation.stripe_refund_id) {
    doc.text(`Refund ID: ${reservation.stripe_refund_id}`)
  }
  doc.text(`Currency: ${reservation.currency ?? 'USD'}`)

  // Footer
  doc.moveDown(4)
  doc.fontSize(8).fillColor('gray')
  doc.text('This invoice was generated by Planviry. Thank you for your business.', { align: 'center' })

  doc.end()

  // Wait for PDF generation to complete
  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
  })

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${invoiceNumber}.pdf"`,
      'Cache-Control': 'no-cache',
    },
  })
}
