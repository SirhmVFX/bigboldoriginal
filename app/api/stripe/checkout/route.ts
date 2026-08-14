import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local' }, { status: 500 });
  }

  const body = await req.json() as {
    orderId?: string;
    email?: string;
    amountNgn?: number;
    currency?: string;
    rateToNgn?: number;
    description?: string;
  };

  const orderId = body.orderId;
  const email = body.email?.trim();
  const amountNgn = Number(body.amountNgn);
  const currency = (body.currency || 'usd').toLowerCase();
  const rateToNgn = Number(body.rateToNgn) || 1;

  if (!orderId || !email || !Number.isFinite(amountNgn) || amountNgn <= 0) {
    return NextResponse.json({ error: 'Invalid payment request' }, { status: 400 });
  }

  const converted = amountNgn / rateToNgn;
  const unitAmount = currency === 'ngn'
    ? Math.round(converted * 100)
    : Math.round(converted * 100);

  if (unitAmount < 50 && currency !== 'ngn') {
    return NextResponse.json({ error: 'Amount too small for Stripe' }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const stripe = new Stripe(secret);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: unitAmount,
          product_data: {
            name: body.description || 'BIGBOLD ORIGINAL order',
          },
        },
      },
    ],
    success_url: `${origin}/checkout/success?gateway=stripe&session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
    cancel_url: `${origin}/checkout?cancelled=1`,
    metadata: { orderId },
  });

  return NextResponse.json({ url: session.url, sessionId: session.id });
}
