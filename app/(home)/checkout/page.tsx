import { redirect } from 'next/navigation'
import { ShippingForm } from '@/components/checkout/shipping-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/auth'
import { OrderSummary } from '@/components/checkout/order-summary'

export default async function CheckoutPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/api/auth/signin?callbackUrl=/checkout')
  }

  return (
    <div className='container max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8'>
      <h1 className='text-3xl font-bold mb-10'>Checkout</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ShippingForm />
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
