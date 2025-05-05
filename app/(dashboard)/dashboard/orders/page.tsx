import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function OrdersPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in')
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      shippingAddress: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Order History</h2>
        <p className='text-muted-foreground'>
          View and manage your order history
        </p>
      </div>
      <div className='space-y-4'>
        {orders.length === 0 ? (
          <p className='text-muted-foreground'>No orders found</p>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>Order #{order.id.slice(-8)}</p>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        order.status === 'DELIVERED'
                          ? 'default'
                          : order.status === 'CANCELLED'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className='capitalize'
                    >
                      {order.status.toLowerCase()}
                    </Badge>
                  </div>
                  <div className='divide-y'>
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className='flex items-center justify-between py-4'
                      >
                        <div className='flex items-center space-x-4'>
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className='h-16 w-16 rounded-md object-cover'
                          />
                          <div>
                            <p className='font-medium'>{item.product.name}</p>
                            <p className='text-sm text-muted-foreground'>
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className='font-medium'>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className='flex justify-between border-t pt-4'>
                    <div>
                      <p className='font-medium'>Shipping Address:</p>
                      <p className='text-sm text-muted-foreground'>
                        {order.shippingAddress.street}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state}{' '}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {order.shippingAddress.country}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm text-muted-foreground'>Total</p>
                      <p className='text-2xl font-bold'>
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
