/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import Stripe from 'stripe'
import { auth } from '@/auth'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

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

    // Create Stripe payment intent
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: 'PENDING',
        total: items.reduce(
          (total: number, item: any) => total + item.price * item.quantity,
          0
        ),
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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(
        (order.total + order.total * 0.1 + 10) * 100 // Total + 10% tax + $10 shipping
      ),
      currency: 'usd',
      metadata: {
        orderId: order.id,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    })
  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
