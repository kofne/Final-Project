'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCart } from '@/store/use-cart'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    reviews?: {
      rating: number
    }[]
  }
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const cart = useCart()
  const { toast } = useToast()
  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length
      : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the button
    cart.addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    })

    toast({
      title: 'Added to cart',
      description: `${product.name} added to your cart`,
      action: (
        <ToastAction altText='View cart' asChild>
          <Link href='/cart'>View Cart</Link>
        </ToastAction>
      ),
    })
  }

  return (
    <Card className={cn('overflow-hidden group', className)}>
      <Link href={`/products/${product.id}`}>
        <div className='aspect-square overflow-hidden relative'>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
        </div>
        <CardHeader className='p-4'>
          <CardTitle className='line-clamp-1'>{product.name}</CardTitle>
          <CardDescription className='line-clamp-2'>
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardContent className='p-4 pt-0'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  )}
                />
              ))}
            </div>
            <span className='text-sm text-gray-600'>
              ({product.reviews?.length || 0})
            </span>
          </div>
          <div className='mt-2 text-xl font-bold'>
            ${product.price.toFixed(2)}
          </div>
        </CardContent>
      </Link>
      <CardFooter className='p-4 pt-0'>
        <Button className='w-full' onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
