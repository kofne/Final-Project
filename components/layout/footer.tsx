import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className='bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Shop */}
          <div>
            <h3 className='font-semibold mb-4'>Shop</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/search'
                  className='text-gray-600 hover:text-gray-900'
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href='/categories'
                  className='text-gray-600 hover:text-gray-900'
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href='/deals'
                  className='text-gray-600 hover:text-gray-900'
                >
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className='font-semibold mb-4'>Customer Service</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/contact'
                  className='text-gray-600 hover:text-gray-900'
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href='/shipping'
                  className='text-gray-600 hover:text-gray-900'
                >
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link
                  href='/returns'
                  className='text-gray-600 hover:text-gray-900'
                >
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className='font-semibold mb-4'>About</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/about'
                  className='text-gray-600 hover:text-gray-900'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='/careers'
                  className='text-gray-600 hover:text-gray-900'
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy'
                  className='text-gray-600 hover:text-gray-900'
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className='font-semibold mb-4'>Connect With Us</h3>
            <div className='flex space-x-4'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-600 hover:text-gray-900'
              >
                <Facebook className='h-6 w-6' />
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-600 hover:text-gray-900'
              >
                <Twitter className='h-6 w-6' />
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-600 hover:text-gray-900'
              >
                <Instagram className='h-6 w-6' />
              </a>
            </div>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t border-gray-200'>
          <p className='text-center text-gray-500'>
            © {new Date().getFullYear()} AI Amazona. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
