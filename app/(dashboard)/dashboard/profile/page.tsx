import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from '@/components/dashboard/profile-form'

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in')
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  })

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Profile Settings</h2>
        <p className='text-muted-foreground'>
          Manage your account settings and preferences
        </p>
      </div>
      <div className='grid gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
