import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
  }

  const { sessionId } = await req.json() as { sessionId?: string };
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session id' }, { status: 400 });
  }

  const stripe = new Stripe(secret);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ paid: false, error: 'Payment not completed' }, { status: 400 });
  }

  return NextResponse.json({
    paid: true,
    reference: session.payment_intent || session.id,
    orderId: session.metadata?.orderId,
  });
}
