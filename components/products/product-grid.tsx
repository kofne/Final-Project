import { Product } from '@prisma/client'
import { ProductCard } from '@/components/ui/product-card'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductGridProps {
  products: Product[]
  loading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ProductGrid({
  products,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className='space-y-4'>
            <Skeleton className='h-[200px] w-full rounded-lg' />
            <Skeleton className='h-4 w-2/3' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-lg font-semibold'>No products found</h3>
        <p className='text-muted-foreground'>
          Try adjusting your search or filter criteria
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className='flex justify-center'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}
