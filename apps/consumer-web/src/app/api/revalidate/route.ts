import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

// POST /api/revalidate
// Called by the vendor dashboard after a vendor saves their profile.
// Body: { slug: string, secret: string }
export async function POST(req: NextRequest) {
  const { slug, secret } = await req.json()

  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!slug || typeof slug !== 'string') {
    return Response.json({ error: 'Missing slug' }, { status: 400 })
  }

  revalidatePath('/vendors/' + slug)
  revalidatePath('/vendors/' + slug + '/gallery')
  revalidatePath('/vendors/' + slug + '/videos')

  return Response.json({ revalidated: true, slug })
}
