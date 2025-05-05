import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ProductGallery } from '@/components/products/product-gallery'
import { ProductInfo } from '@/components/products/product-info'
import { ProductReviews } from '@/components/products/product-reviews'
import { ProductRelated } from '@/components/products/product-related'

type tParams = Promise<{ id: string }>

interface ProductPageProps {
  params: tParams
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!product) {
    notFound()
  }

  return product
}

export default async function ProductPage(props: ProductPageProps) {
  const { id } = await props.params
  const product = await getProduct(id)

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'>
        {/* Product Gallery */}
        <ProductGallery images={product.images} />

        {/* Product Information */}
        <ProductInfo product={product} />
      </div>

      {/* Reviews Section */}
      <div className='mb-16'>
        <ProductReviews productId={product.id} reviews={product.reviews} />
      </div>

      {/* Related Products */}
      <div>
        <ProductRelated
          categoryId={product.categoryId}
          currentProductId={product.id}
        />
      </div>
    </div>
  )
}
