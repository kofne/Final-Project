'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

interface OrderStatsProps {
  data: {
    name: string
    value: number
  }[]
}

export function OrderStats({ data }: OrderStatsProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className='col-span-full lg:col-span-3'>
      <CardHeader>
        <CardTitle>Order Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-[400px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={120}
                fill='#8884d8'
                dataKey='value'
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className='rounded-lg border bg-background p-2 shadow-sm'>
                        <div className='grid gap-2'>
                          <div className='flex flex-col'>
                            <span className='text-[0.70rem] uppercase text-muted-foreground'>
                              Status
                            </span>
                            <span className='font-bold text-muted-foreground'>
                              {data.name}
                            </span>
                          </div>
                          <div className='flex flex-col'>
                            <span className='text-[0.70rem] uppercase text-muted-foreground'>
                              Orders
                            </span>
                            <span className='font-bold'>
                              {data.value} (
                              {((data.value / total) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
