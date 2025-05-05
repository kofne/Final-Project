import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { OrderStatus, Role } from '@prisma/client'

async function getMetrics() {
  try {
    const session = await auth()

    if (!session || session.user.role !== Role.ADMIN) {
      throw new Error('Unauthorized')
    }

    // Get current date and date for last month
    const now = new Date()
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000)

    // Get total revenue and compare with last month
    const [totalRevenue, lastMonthRevenue] = await Promise.all([
      prisma.order.aggregate({
        where: { status: OrderStatus.DELIVERED },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          status: OrderStatus.DELIVERED,
          createdAt: { lt: now, gte: lastMonth },
        },
        _sum: { total: true },
      }),
    ])

    // Get total orders and compare with last hour
    const [totalOrders, lastHourOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: {
          createdAt: { lt: now, gte: lastHour },
        },
      }),
    ])

    // Get total customers and compare with last month
    const [totalCustomers, lastMonthCustomers] = await Promise.all([
      prisma.user.count({ where: { role: Role.USER } }),
      prisma.user.count({
        where: {
          role: Role.USER,
          createdAt: { lt: now, gte: lastMonth },
        },
      }),
    ])

    // Calculate average order value and compare with last week
    const [currentAOV, lastWeekAOV] = await Promise.all([
      prisma.order.aggregate({
        where: { status: OrderStatus.DELIVERED },
        _avg: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          status: OrderStatus.DELIVERED,
          createdAt: { lt: now, gte: lastWeek },
        },
        _avg: { total: true },
      }),
    ])

    const totalRevenueCurrent = totalRevenue._sum.total || 0
    const lastMonthRevenueCurrent = lastMonthRevenue._sum.total || 0
    const currentAOVValue = currentAOV._avg.total || 0
    const lastWeekAOVValue = lastWeekAOV._avg.total || 0

    // Calculate percentage changes
    const revenueChange = lastMonthRevenueCurrent
      ? ((totalRevenueCurrent - lastMonthRevenueCurrent) /
          lastMonthRevenueCurrent) *
        100
      : 0

    const customerChange = lastMonthCustomers
      ? ((totalCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
      : 0

    const aovChange = lastWeekAOVValue
      ? ((currentAOVValue - lastWeekAOVValue) / lastWeekAOVValue) * 100
      : 0

    return {
      totalRevenue: totalRevenueCurrent,
      revenueChange,
      totalOrders,
      newOrders: lastHourOrders,
      totalCustomers,
      customerChange,
      averageOrderValue: currentAOVValue,
      aovChange,
    }
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return null
  }
}

export async function MetricsCards() {
  const metrics = await getMetrics()

  if (!metrics) {
    return <div>Failed to load metrics</div>
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Suspense fallback={<MetricCardSkeleton />}>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatCurrency(metrics.totalRevenue)}
            </div>
            <p className='text-xs text-muted-foreground'>
              {metrics.revenueChange > 0 ? '+' : ''}
              {metrics.revenueChange.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
      </Suspense>

      <Suspense fallback={<MetricCardSkeleton />}>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+{metrics.totalOrders}</div>
            <p className='text-xs text-muted-foreground'>
              +{metrics.newOrders} since last hour
            </p>
          </CardContent>
        </Card>
      </Suspense>

      <Suspense fallback={<MetricCardSkeleton />}>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{metrics.totalCustomers}</div>
            <p className='text-xs text-muted-foreground'>
              {metrics.customerChange > 0 ? '+' : ''}
              {metrics.customerChange.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
      </Suspense>

      <Suspense fallback={<MetricCardSkeleton />}>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatCurrency(metrics.averageOrderValue)}
            </div>
            <p className='text-xs text-muted-foreground'>
              {metrics.aovChange > 0 ? '+' : ''}
              {metrics.aovChange.toFixed(1)}% from last week
            </p>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  )
}

function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <Skeleton className='h-4 w-24' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-8 w-36 mb-2' />
        <Skeleton className='h-4 w-24' />
      </CardContent>
    </Card>
  )
}
