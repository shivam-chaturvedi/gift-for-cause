import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (requireAuth && !user) {
      toast({
        title: "Login Required",
        description: "Please log in to make a donation.",
        variant: "destructive",
      })
      navigate("/login")
    }
  }, [user, requireAuth, navigate, toast])

  if (requireAuth && !user) {
    return null
  }

  return <>{children}</>
}