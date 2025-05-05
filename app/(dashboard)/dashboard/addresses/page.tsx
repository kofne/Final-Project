import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddressForm } from '@/components/dashboard/address-form'
import { AddressList } from '@/components/dashboard/address-list'

export default async function AddressesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in')
  }

  const addresses = await prisma.address.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      isDefault: 'desc',
    },
  })

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>
          Shipping Addresses
        </h2>
        <p className='text-muted-foreground'>Manage your shipping addresses</p>
      </div>
      <div className='grid gap-8'>
        <Card>
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressList addresses={addresses} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
