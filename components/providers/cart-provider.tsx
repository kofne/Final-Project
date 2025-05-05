'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/store/use-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // This will hydrate the cart with the persisted data from localStorage
    const savedCart = localStorage.getItem('shopping-cart')
    if (savedCart) {
      try {
        const { state } = JSON.parse(savedCart)
        if (state && state.items) {
          useCart.setState({ items: state.items })
        }
      } catch (error) {
        console.error('Error hydrating cart:', error)
      }
    }
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return null // Prevent flash of incorrect content
  }

  return <>{children}</>
}
