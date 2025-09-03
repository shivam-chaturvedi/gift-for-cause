import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { adminAPI, donationAPI } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, DollarSign, Users, Shield, TrendingUp, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

interface PendingNGO {
  id: string
  name: string
  reg_no: string
  mission: string
  category: string
  created_at: string
  contact_email: string
}

interface PendingStory {
  id: string
  title: string
  story_text: string
  created_at: string
  ngos: {
    name: string
  }
}

interface AuditLog {
  id: string
  action: string
  entity: string
  status: string
  created_at: string
  users: {
    name: string
  }
}

export function AdminDashboard() {
  const { user } = useAuth()
  const [pendingNGOs, setPendingNGOs] = useState<PendingNGO[]>([])
  const [pendingStories, setPendingStories] = useState<PendingStory[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState({ totalRaised: 0, totalDonations: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ngosData, storiesData, logsData, statsData] = await Promise.all([
          adminAPI.getPendingNGOs(),
          adminAPI.getPendingStories(),
          adminAPI.getAuditLogs(),
          donationAPI.getStats()
        ])
        setPendingNGOs(ngosData)
        setPendingStories(storiesData)
        setAuditLogs(logsData)
        setStats(statsData)
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleVerifyNGO = async (ngoId: string) => {
    try {
      await adminAPI.createAuditLog({
        user_id: user?.id || '',
        action: 'ngo_verified',
        entity: 'ngos',
        status: 'success',
        details: { ngo_id: ngoId }
      })
      setPendingNGOs(prev => prev.filter(ngo => ngo.id !== ngoId))
    } catch (error) {
      console.error('Error verifying NGO:', error)
    }
  }

  const handleApproveStory = async (storyId: string) => {
    try {
      await adminAPI.createAuditLog({
        user_id: user?.id || '',
        action: 'story_approved',
        entity: 'success_stories',
        status: 'success',
        details: { story_id: storyId }
      })
      setPendingStories(prev => prev.filter(story => story.id !== storyId))
    } catch (error) {
      console.error('Error approving story:', error)
    }
  }

  const statsCards = [
    {
      title: 'Total Platform Raised',
      value: `$${stats.totalRaised.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Total Donations',
      value: stats.totalDonations.toString(),
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Pending NGO Approvals',
      value: pendingNGOs.length.toString(),
      icon: Shield,
      color: 'text-orange-600'
    },
    {
      title: 'Pending Stories',
      value: pendingStories.length.toString(),
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ]

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage platform operations and approve content
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ngos">NGO Approvals</TabsTrigger>
            <TabsTrigger value="stories">Story Approvals</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform KPIs */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform KPIs</CardTitle>
                  <CardDescription>
                    Key performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Total Platform Revenue</span>
                        <span>${stats.totalRaised.toLocaleString()}</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Donation Success Rate</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>NGO Verification Rate</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest platform activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-gray-500">
                            {log.users?.name} • {new Date(log.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={log.status === 'success' ? 'default' : 'secondary'}>
                          {log.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ngos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending NGO Approvals</CardTitle>
                <CardDescription>
                  Review and approve new NGO registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingNGOs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>NGO Name</TableHead>
                        <TableHead>Registration No</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingNGOs.map((ngo) => (
                        <TableRow key={ngo.id}>
                          <TableCell className="font-medium">{ngo.name}</TableCell>
                          <TableCell>{ngo.reg_no}</TableCell>
                          <TableCell>{ngo.category}</TableCell>
                          <TableCell>{ngo.contact_email}</TableCell>
                          <TableCell>
                            {new Date(ngo.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleVerifyNGO(ngo.id)}
                              >
                                Approve
                              </Button>
                              <Button size="sm" variant="outline">
                                Review
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No pending NGO approvals
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Story Approvals</CardTitle>
                <CardDescription>
                  Review and approve success stories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingStories.length > 0 ? (
                  <div className="space-y-4">
                    {pendingStories.map((story) => (
                      <div key={story.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium">{story.title}</h3>
                            <p className="text-sm text-gray-500">
                              {story.ngos?.name} • {new Date(story.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveStory(story.id)}
                            >
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              Reject
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {story.story_text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No pending story approvals
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>
                  Complete audit trail of platform activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{log.users?.name}</TableCell>
                        <TableCell className="capitalize">{log.action.replace('_', ' ')}</TableCell>
                        <TableCell className="capitalize">{log.entity}</TableCell>
                        <TableCell>
                          <Badge variant={log.status === 'success' ? 'default' : 'secondary'}>
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
