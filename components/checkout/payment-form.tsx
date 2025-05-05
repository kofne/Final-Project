'use client'

import { useState, useEffect } from 'react'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface PaymentFormProps {
  orderId: string
}

function PaymentFormContent({ orderId }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    if (!stripe || !elements) {
      return
    }

    try {
      // Confirm the payment
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation/${orderId}`,
        },
      })

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error) {
      console.error('[PAYMENT_ERROR]', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Payment failed',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <PaymentElement />
      <Button type='submit' className='w-full' disabled={isLoading || !stripe}>
        {isLoading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  )
}

export function PaymentForm({ orderId }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string>('')

  useEffect(() => {
    // Get the client secret when the component mounts
    fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => console.error('Failed to get client secret:', error))
  }, [orderId])

  if (!clientSecret) {
    return null
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormContent orderId={orderId} />
    </Elements>
  )
}
