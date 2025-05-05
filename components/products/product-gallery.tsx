'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  if (!images.length) {
    return (
      <div className='aspect-square w-full bg-secondary flex items-center justify-center rounded-lg'>
        <span className='text-muted-foreground'>No image available</span>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Main Image */}
      <div className='aspect-square w-full relative rounded-lg overflow-hidden'>
        <Image
          src={images[selectedImage]}
          alt='Product image'
          fill
          className='object-cover'
          priority
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className='grid grid-cols-4 gap-4'>
          {images.map((image, index) => (
            <button
              key={image}
              className={cn(
                'aspect-square relative rounded-lg overflow-hidden',
                selectedImage === index && 'ring-2 ring-primary'
              )}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 25vw, 10vw'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
