import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AdminHeader } from '@/components/admin/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <AdminHeader />
      <main className='container mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        {children}
      </main>
    </div>
  )
}
