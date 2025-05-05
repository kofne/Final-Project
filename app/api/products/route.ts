import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

const ITEMS_PER_PAGE = 12

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999')
    const sort = searchParams.get('sort')

    // Build where clause for filtering
    const where: Prisma.ProductWhereInput = {
      AND: [
        { price: { gte: minPrice } },
        { price: { lte: maxPrice } },
        ...(category ? [{ categoryId: category }] : []),
        ...(search
          ? [
              {
                OR: [
                  {
                    name: {
                      contains: search,
                      mode: 'insensitive' as Prisma.QueryMode,
                    },
                  },
                  {
                    description: {
                      contains: search,
                      mode: 'insensitive' as Prisma.QueryMode,
                    },
                  },
                ],
              },
            ]
          : []),
      ],
    }

    // Build orderBy clause for sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = {}
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' }
        break
      case 'price_desc':
        orderBy = { price: 'desc' }
        break
      case 'name_asc':
        orderBy = { name: 'asc' }
        break
      case 'name_desc':
        orderBy = { name: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where })

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      products,
      total,
      perPage: ITEMS_PER_PAGE,
      page,
    })
  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
