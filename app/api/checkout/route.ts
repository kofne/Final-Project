import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!
const PAYPAL_API = 'https://api-m.sandbox.paypal.com' // Use 'https://api-m.paypal.com' for live

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  return data.access_token
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { items, shippingAddress } = body

    if (!items?.length || !shippingAddress) {
      return new NextResponse('Bad request', { status: 400 })
    }

    // Calculate total
    const total = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: 'PENDING',
        total,
        addressId: shippingAddress.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // Create PayPal order
    const accessToken = await getPayPalAccessToken()
    const paypalOrderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: total.toFixed(2),
            },
            custom_id: order.id,
          },
        ],
        application_context: {
          return_url: 'https://yourdomain.com/success',
          cancel_url: 'https://yourdomain.com/cancel',
        },
      }),
    })
    const paypalOrder = await paypalOrderRes.json()

    // Return PayPal order ID and approval link
    const approvalUrl = paypalOrder.links?.find((l: any) => l.rel === 'approve')?.href

    return NextResponse.json({
      paypalOrderId: paypalOrder.id,
      approvalUrl,
      orderId: order.id,
    })
  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
