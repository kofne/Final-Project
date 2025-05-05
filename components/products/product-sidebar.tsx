'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Category {
  id: string
  name: string
}

export function ProductSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  )
  const [selectedSort, setSelectedSort] = useState(
    searchParams.get('sort') || 'default'
  )

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (selectedCategory && selectedCategory !== 'all')
      params.set('category', selectedCategory)
    if (selectedSort && selectedSort !== 'default')
      params.set('sort', selectedSort)
    params.set('minPrice', priceRange[0].toString())
    params.set('maxPrice', priceRange[1].toString())

    router.push(`/products?${params.toString()}`)
  }

  const handleReset = () => {
    setSelectedCategory('all')
    setSelectedSort('default')
    setPriceRange([0, 1000])
    router.push('/products')
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Label>Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder='Select category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label>Price Range</Label>
        <div className='pt-2'>
          <Slider
            value={priceRange}
            min={0}
            max={1000}
            step={10}
            onValueChange={setPriceRange}
          />
        </div>
        <div className='flex justify-between text-sm'>
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div className='space-y-2'>
        <Label>Sort By</Label>
        <Select value={selectedSort} onValueChange={setSelectedSort}>
          <SelectTrigger>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='default'>Default</SelectItem>
            <SelectItem value='price_asc'>Price: Low to High</SelectItem>
            <SelectItem value='price_desc'>Price: High to Low</SelectItem>
            <SelectItem value='name_asc'>Name: A to Z</SelectItem>
            <SelectItem value='name_desc'>Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Button onClick={handleFilter} className='w-full'>
          Apply Filters
        </Button>
        <Button onClick={handleReset} variant='outline' className='w-full'>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
