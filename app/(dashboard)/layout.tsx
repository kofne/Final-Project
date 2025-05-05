import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { Header } from '@/components/layout/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in')
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <div className='container grid flex-1 gap-12 px-6 py-6 md:grid-cols-[200px_1fr]'>
        <aside className='hidden w-[200px] flex-col md:flex'>
          <DashboardNav />
        </aside>
        <main className='flex w-full flex-1 flex-col overflow-hidden'>
          {children}
        </main>
      </div>
    </div>
  )
}
