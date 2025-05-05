'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/store/use-cart'

export function CartBadge() {
  const cart = useCart()
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Button variant='ghost' size='icon' asChild className='relative'>
      <Link href='/cart'>
        <ShoppingCart className='h-5 w-5' />
        {itemCount > 0 && (
          <span className='absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}
