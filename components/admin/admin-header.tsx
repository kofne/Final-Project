'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  BarChart,
  ShoppingBag,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminHeader() {
  const pathname = usePathname()

  return (
    <header className='border-b bg-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo and Navigation */}
          <div className='flex items-center gap-8'>
            <div className='flex items-center gap-6'>
              <Link
                href='/'
                className='flex items-center gap-2 text-xl font-bold'
              >
                <ShoppingBag className='h-6 w-6' />
                <span>AI Amazona</span>
              </Link>
              <div className='h-6 w-px bg-gray-200' />
              <Link href='/admin' className='text-gray-600 hover:text-gray-900'>
                Admin
              </Link>
            </div>

            {/* Navigation */}
            <nav className='hidden md:flex items-center gap-6'>
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-black'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <item.icon className='h-4 w-4' />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
