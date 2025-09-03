import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { wishlistAPI, donationAPI, successStoryAPI } from '@/lib/api'
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
import { Calendar, DollarSign, Gift, TrendingUp, Users, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

interface WishlistWithItems {
  id: string
  title: string
  status: string
  created_at: string
  target_amount: number
  description: string
  wishlist_items: Array<{
    id: string
    name: string
    price: number
    qty: number
    funded_qty: number
  }>
}

interface DonationWithDetails {
  id: string
  amount: number
  status: string
  created_at: string
  wishlist_items: {
    name: string
  }
  users: {
    name: string
    email: string
  }
}

export function NGODashboard() {
  const { user } = useAuth()
  const [wishlists, setWishlists] = useState<WishlistWithItems[]>([])
  const [donations, setDonations] = useState<DonationWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newStory, setNewStory] = useState({
    title: '',
    story_text: '',
    impact_metrics: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // For demo purposes, we'll use a mock NGO ID
          const mockNGOId = '550e8400-e29b-41d4-a716-446655440001'
          const [wishlistsData, donationsData] = await Promise.all([
            wishlistAPI.getByNGO(mockNGOId),
            donationAPI.getByNGO(mockNGOId)
          ])
          setWishlists(wishlistsData)
          setDonations(donationsData)
        } catch (error) {
          console.error('Error fetching NGO dashboard data:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchData()
  }, [user])

  const totalRaised = donations
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + Number(d.amount), 0)

  const totalDonations = donations.filter(d => d.status === 'completed').length
  const activeWishlists = wishlists.filter(w => w.status === 'published').length
  const pendingWishlists = wishlists.filter(w => w.status === 'draft').length

  const statsCards = [
    {
      title: 'Total Raised',
      value: `$${totalRaised.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Donations Received',
      value: totalDonations.toString(),
      icon: Gift,
      color: 'text-blue-600'
    },
    {
      title: 'Active Wishlists',
      value: activeWishlists.toString(),
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      title: 'This Month',
      value: `$${(totalRaised * 0.4).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ]

  const handleSubmitStory = async () => {
    try {
      const mockNGOId = '550e8400-e29b-41d4-a716-446655440001'
      await successStoryAPI.create({
        ngo_id: mockNGOId,
        title: newStory.title,
        story_text: newStory.story_text,
        impact_metrics: newStory.impact_metrics,
        media_url: '/api/placeholder/400/300'
      })
      setNewStory({ title: '', story_text: '', impact_metrics: '' })
      // You could add a toast notification here
    } catch (error) {
      console.error('Error submitting story:', error)
    }
  }

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
            NGO Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your wishlists, track donations, and share impact stories
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
            <TabsTrigger value="wishlists">Wishlists</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Donations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Donations</CardTitle>
                  <CardDescription>
                    Latest contributions to your causes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {donations.slice(0, 5).map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{donation.wishlist_items?.name}</p>
                          <p className="text-sm text-gray-500">
                            {donation.users?.name || 'Anonymous'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${Number(donation.amount).toLocaleString()}</p>
                          <Badge variant={donation.status === 'completed' ? 'default' : 'secondary'}>
                            {donation.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Wishlist Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Wishlist Progress</CardTitle>
                  <CardDescription>
                    Current status of your wishlists
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {wishlists.slice(0, 3).map((wishlist) => {
                      const totalItems = wishlist.wishlist_items?.length || 0
                      const fundedItems = wishlist.wishlist_items?.filter(item => item.funded_qty >= item.qty).length || 0
                      const progress = totalItems > 0 ? (fundedItems / totalItems) * 100 : 0

                      return (
                        <div key={wishlist.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{wishlist.title}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-gray-500">
                            {fundedItems} of {totalItems} items funded
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="wishlists" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Wishlists</h2>
              <Button>Create New Wishlist</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlists.map((wishlist) => (
                <Card key={wishlist.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{wishlist.title}</CardTitle>
                    <CardDescription>{wishlist.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Status</span>
                        <Badge variant={wishlist.status === 'published' ? 'default' : 'secondary'}>
                          {wishlist.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Target</span>
                        <span>${wishlist.target_amount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Items</span>
                        <span>{wishlist.wishlist_items?.length || 0}</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        Manage Items
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="donations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Donations</CardTitle>
                <CardDescription>
                  Complete list of donations received
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Donor</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>
                          {new Date(donation.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{donation.users?.name || 'Anonymous'}</TableCell>
                        <TableCell>{donation.wishlist_items?.name}</TableCell>
                        <TableCell>${Number(donation.amount).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={donation.status === 'completed' ? 'default' : 'secondary'}>
                            {donation.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Success Stories</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Submit New Story</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Submit Success Story</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Story Title</Label>
                      <Input
                        id="title"
                        value={newStory.title}
                        onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                        placeholder="Enter story title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="story">Story Content</Label>
                      <Textarea
                        id="story"
                        value={newStory.story_text}
                        onChange={(e) => setNewStory({ ...newStory, story_text: e.target.value })}
                        placeholder="Tell us about the impact..."
                        rows={4}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="metrics">Impact Metrics</Label>
                      <Input
                        id="metrics"
                        value={newStory.impact_metrics}
                        onChange={(e) => setNewStory({ ...newStory, impact_metrics: e.target.value })}
                        placeholder="e.g., 1000+ families served, 90% improvement"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSubmitStory}>Submit Story</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Stories</CardTitle>
                <CardDescription>
                  Success stories submitted by your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Clean Water Transforms Village Life</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      The installation of water purification systems in rural villages has dramatically improved health outcomes.
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="default">Approved</Badge>
                      <span className="text-xs text-gray-500">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
