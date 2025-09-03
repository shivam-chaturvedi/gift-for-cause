import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { DonorDashboard } from '@/components/dashboard/DonorDashboard'
import { NGODashboard } from '@/components/dashboard/NGODashboard'
import { AdminDashboard } from '@/components/dashboard/AdminDashboard'
import { Skeleton } from '@/components/ui/skeleton'

export default function Dashboard() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login')
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Render different dashboards based on user role
  switch (user.role) {
    case 'donor':
      return <DonorDashboard />
    case 'ngo_owner':
    case 'ngo_editor':
      return <NGODashboard />
    case 'admin':
    case 'moderator':
      return <AdminDashboard />
    default:
      return <DonorDashboard />
  }
}
