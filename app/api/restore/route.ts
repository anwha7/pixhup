import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('credits').eq('id', user.id).single()

  if (!profile || profile.credits < 1) {
    return NextResponse.json({ error: 'Out of credits — buy more to keep going.' }, { status: 402 })
  }

  const formData = await req.formData()
  const file = formData.get('photo') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No photo was uploaded.' }, { status: 400 })
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const result = await openai.images.edit({
      model: 'gpt-image-1.5',
      image: file,
      prompt:
        'Restore this old or damaged photograph. Repair scratches, creases, and stains. Correct fading, and if the photo is black and white, add natural, historically plausible color. Sharpen soft detail. Keep every person, their exact likeness and expression, and the original composition unchanged — restore the photo, do not reimagine it.',
    })

    const b64 = result.data[0].b64_json

    // Only deduct once we know the restore actually succeeded
    await admin.from('profiles').update({ credits: profile.credits - 1 }).eq('id', user.id)

    return NextResponse.json({ image: `data:image/png;base64,${b64}` })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: 'The restore failed. Nothing was charged — try again.' }, { status: 500 })
  }
}
