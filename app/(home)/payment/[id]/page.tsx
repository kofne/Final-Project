import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { PaymentForm } from '@/components/checkout/payment-form'
import { OrderSummary } from '@/components/checkout/order-summary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type tParams = Promise<{ id: string }>

interface PageProps {
  params: tParams
}

export default async function PaymentPage({ params }: PageProps) {
  const session = await auth()
  const { id } = await params

  if (!session?.user) {
    redirect('/api/auth/signin?callbackUrl=/payment/' + id)
  }

  const order = await prisma.order.findUnique({
    where: {
      id: id,
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
  })

  if (!order) {
    redirect('/')
  }

  // If order is already paid, redirect to confirmation
  if (order.stripePaymentId) {
    redirect(`/order-confirmation/${order.id}`)
  }

  return (
    <div className='container max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8'>
      <h1 className='text-3xl font-bold mb-10'>Payment</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentForm orderId={id} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderSummary />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
