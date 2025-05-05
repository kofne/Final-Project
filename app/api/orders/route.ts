import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
}

interface ShippingInfo {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface OrderBody {
  items: CartItem[]
  shippingInfo: ShippingInfo
  total: number
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized: User ID is required', {
        status: 401,
      })
    }

    const body = await req.json()
    const { items, shippingInfo, total } = body as OrderBody

    if (!items?.length) {
      return new NextResponse('Bad Request: Cart items are required', {
        status: 400,
      })
    }

    if (!shippingInfo) {
      return new NextResponse('Bad Request: Shipping information is required', {
        status: 400,
      })
    }

    // Verify all products exist and are in stock
    const productIds = items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    })

    // Check if all products exist
    if (products.length !== items.length) {
      const foundProductIds = products.map((p) => p.id)
      const missingProductIds = productIds.filter(
        (id) => !foundProductIds.includes(id)
      )
      return new NextResponse(
        `Products not found: ${missingProductIds.join(', ')}`,
        {
          status: 400,
        }
      )
    }

    // Check stock levels
    const insufficientStock = items.filter((item) => {
      const product = products.find((p) => p.id === item.productId)
      return product && product.stock < item.quantity
    })

    if (insufficientStock.length > 0) {
      return new NextResponse(
        `Insufficient stock for products: ${insufficientStock
          .map((item) => item.productId)
          .join(', ')}`,
        { status: 400 }
      )
    }

    // Create shipping address
    const address = await prisma.address.create({
      data: {
        street: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        postalCode: shippingInfo.zipCode,
        country: shippingInfo.country,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })

    // Start a transaction to ensure all operations succeed or fail together
    const order = await prisma.$transaction(async (tx) => {
      // Create order with items
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          addressId: address.id,
          total,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
          shippingAddress: true,
        },
      })

      // Update product stock levels
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      // Clear the user's cart if it exists
      await tx.cart
        .delete({
          where: { userId: session.user.id },
        })
        .catch(() => {
          // Ignore error if cart doesn't exist
        })

      return newOrder
    })

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error('[ORDERS_POST]', error)
    if (error instanceof Error) {
      return new NextResponse(`Error: ${error.message}`, { status: 500 })
    }
    return new NextResponse('Internal error', { status: 500 })
  }
}
