import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: 'Paystack is not configured' }, { status: 500 });
  }

  const { reference } = await req.json() as { reference?: string };
  if (!reference) {
    return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const data = await res.json() as {
    status?: boolean;
    message?: string;
    data?: { status: string; reference: string; amount: number; metadata?: { orderId?: string } };
  };

  if (!res.ok || !data.status || data.data?.status !== 'success') {
    return NextResponse.json({ paid: false, error: data.message || 'Verification failed' }, { status: 400 });
  }

  return NextResponse.json({
    paid: true,
    reference: data.data.reference,
    orderId: data.data.metadata?.orderId,
    amount: data.data.amount,
  });
}
