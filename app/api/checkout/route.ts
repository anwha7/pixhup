import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'Pixhup Starter Pack — 12 credits' },
          unit_amount: 500, // $5.00, in cents
        },
        quantity: 1,
      },
    ],
    client_reference_id: user.id,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?purchase=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?purchase=cancelled`,
  })

  return NextResponse.json({ url: session.url })
}
