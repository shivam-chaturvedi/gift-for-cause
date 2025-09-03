import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { donationAPI } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, DollarSign, Heart, TrendingUp, Users } from 'lucide-react'
import { motion } from 'framer-motion'

interface DonationWithDetails {
  id: string
  amount: number
  status: string
  created_at: string
  gateway: string
  wishlist_items: {
    name: string
    image_url: string
  }
  ngos: {
    name: string
    slug: string
  }
}

export function DonorDashboard() {
  const { user } = useAuth()
  const [donations, setDonations] = useState<DonationWithDetails[]>([])
  const [stats, setStats] = useState({ totalRaised: 0, totalDonations: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [donationsData, statsData] = await Promise.all([
            donationAPI.getByUser(user.id),
            donationAPI.getStats()
          ])
          setDonations(donationsData)
          setStats(statsData)
        } catch (error) {
          console.error('Error fetching dashboard data:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchData()
  }, [user])

  const recentDonations = donations.slice(0, 5)
  const completedDonations = donations.filter(d => d.status === 'completed')
  const totalAmount = completedDonations.reduce((sum, d) => sum + Number(d.amount), 0)

  const statsCards = [
    {
      title: 'Total Donated',
      value: `$${totalAmount.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Donations Made',
      value: completedDonations.length.toString(),
      icon: Heart,
      color: 'text-red-600'
    },
    {
      title: 'This Month',
      value: `$${(totalAmount * 0.3).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'NGOs Supported',
      value: new Set(donations.map(d => d.ngos?.name)).size.toString(),
      icon: Users,
      color: 'text-purple-600'
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
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your donations and impact on our community
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
            <TabsTrigger value="donations">Donation History</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Donations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Donations</CardTitle>
                  <CardDescription>
                    Your latest contributions to causes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDonations.length > 0 ? (
                      recentDonations.map((donation) => (
                        <div key={donation.id} className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={donation.wishlist_items?.image_url} />
                            <AvatarFallback>
                              {donation.ngos?.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {donation.wishlist_items?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {donation.ngos?.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              ${Number(donation.amount).toLocaleString()}
                            </p>
                            <Badge variant={donation.status === 'completed' ? 'default' : 'secondary'}>
                              {donation.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No donations yet. Start making a difference today!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Impact Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Impact</CardTitle>
                  <CardDescription>
                    Summary of your contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Total Impact</span>
                        <span>${totalAmount.toLocaleString()}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {completedDonations.length}
                        </p>
                        <p className="text-xs text-gray-500">Donations</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {new Set(donations.map(d => d.ngos?.name)).size}
                        </p>
                        <p className="text-xs text-gray-500">NGOs Supported</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="donations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
                <CardDescription>
                  Complete list of your donations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>NGO</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Gateway</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>
                          {new Date(donation.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{donation.ngos?.name}</TableCell>
                        <TableCell>{donation.wishlist_items?.name}</TableCell>
                        <TableCell>${Number(donation.amount).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={donation.status === 'completed' ? 'default' : 'secondary'}>
                            {donation.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{donation.gateway}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receipts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Receipts</CardTitle>
                <CardDescription>
                  Download your donation receipts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedDonations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{donation.ngos?.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${Number(donation.amount).toLocaleString()}</p>
                        <Button variant="outline" size="sm">
                          Download Receipt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
