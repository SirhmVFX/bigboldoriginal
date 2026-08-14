import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: 'Paystack is not configured. Set PAYSTACK_SECRET_KEY in .env.local' }, { status: 500 });
  }

  const body = await req.json() as {
    email?: string;
    amountNgn?: number;
    orderId?: string;
    callbackUrl?: string;
  };

  const email = body.email?.trim();
  const amountNgn = Number(body.amountNgn);
  const orderId = body.orderId;

  if (!email || !orderId || !Number.isFinite(amountNgn) || amountNgn <= 0) {
    return NextResponse.json({ error: 'Invalid payment request' }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const callbackUrl = body.callbackUrl || `${origin}/checkout/success?gateway=paystack&orderId=${orderId}`;

  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amountNgn * 100),
      currency: 'NGN',
      callback_url: callbackUrl,
      metadata: { orderId },
    }),
  });

  const data = await res.json() as { status?: boolean; message?: string; data?: { authorization_url: string; reference: string } };
  if (!res.ok || !data.status || !data.data) {
    return NextResponse.json({ error: data.message || 'Paystack initialize failed' }, { status: 502 });
  }

  return NextResponse.json({
    authorization_url: data.data.authorization_url,
    reference: data.data.reference,
  });
}
