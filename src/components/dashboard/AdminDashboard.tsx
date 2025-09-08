import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, TrendingUp, Shield, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface PendingNGO {
  id: string;
  name: string;
  category: string;
  email: string;
  created_at: string;
}

interface PendingStory {
  id: string;
  title: string;
  story_text: string;
  created_at: string;
  ngo_id: {
    name: string;
  };
}

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  status: string;
  created_at: string;
  users: {
    name: any;
  };
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [pendingNGOs, setPendingNGOs] = useState<PendingNGO[]>([]);
  const [pendingStories, setPendingStories] = useState<PendingStory[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState({ totalRaised: 0, totalDonations: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: ngosData, error: ngosError } = await supabase
          .from("ngo")
          .select("id, name, category, created_at, email")
          .eq("verified", false);

        if (ngosError) throw ngosError;
        setPendingNGOs(ngosData || []);

        // Pending Stories (approved = false)
        const { data: storiesData, error: storiesError } = await supabase
          .from("success_stories")
          .select("id, title, story_text, created_at, ngo_id(name)")
          .eq("approved", false);
        if (storiesError) throw storiesError;
        setPendingStories(
          (storiesData || []).map((story: any) => ({
            ...story,
            ngo_id: Array.isArray(story.ngo_id)
              ? story.ngo_id[0]
              : story.ngo_id,
          }))
        );

        // Audit Logs
        const { data: logsData, error: logsError } = await supabase
          .from("audit_logs")
          .select("id, action, entity, status, created_at, users(name)")
          .order("created_at", { ascending: false })
          .limit(20);

        if (logsError) throw logsError;
        setAuditLogs(
          (logsData || []).map((log: any) => ({
            ...log,
            users: Array.isArray(log.users) ? log.users[0] : log.users,
          }))
        );

        // Stats (aggregate donations)
        const { data: donationsData, error: donationsError } = await supabase
          .from("donations")
          .select("amount");
        if (donationsError) throw donationsError;

        const totalRaised =
          donationsData?.reduce((sum, d) => sum + (d.amount as number), 0) || 0;
        const totalDonations = donationsData?.length || 0;
        setStats({ totalRaised, totalDonations });
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVerifyNGO = async (ngoId: string) => {
    try {
      const { error } = await supabase
        .from("ngo")
        .update({ verified: true })
        .eq("id", ngoId);
      if (error) throw error;

      setPendingNGOs((prev) => prev.filter((ngo) => ngo.id !== ngoId));

      await supabase.from("audit_logs").insert({
        user_id: user?.id,
        action: "ngo_verified",
        entity: "ngo",
        status: "success",
        details: { ngo_id: ngoId },
      });

      toast({
        title: "NGO Verified",
        description: "The NGO has been successfully verified.",
        duration: 5000,
      });
      // Audit Logs
      const { data: logsData, error: logsError } = await supabase
        .from("audit_logs")
        .select("id, action, entity, status, created_at, users(name)")
        .order("created_at", { ascending: false })
        .limit(20);

      if (logsError) throw logsError;
      setAuditLogs(
        (logsData || []).map((log: any) => ({
          ...log,
          users: Array.isArray(log.users) ? log.users[0] : log.users,
        }))
      );
    } catch (error) {
      console.error("Error verifying NGO:", error);
    }
  };

  const handleApproveStory = async (storyId: string) => {
    try {
      const { error } = await supabase
        .from("success_stories")
        .update({ approved: true })
        .eq("id", storyId);
      if (error) throw error;

      setPendingStories((prev) => prev.filter((story) => story.id !== storyId));

      await supabase.from("audit_logs").insert({
        user_id: user?.id,
        action: "story_approved",
        entity: "success_stories",
        status: "success",
        details: { story_id: storyId },
      });
      toast({
        title: "Story Approved",
        description: "The success story has been successfully approved.",
        duration: 5000,
      });
      // Audit Logs
      const { data: logsData, error: logsError } = await supabase
        .from("audit_logs")
        .select("id, action, entity, status, created_at, users(name)")
        .order("created_at", { ascending: false })
        .limit(20);

      if (logsError) throw logsError;
      setAuditLogs(
        (logsData || []).map((log: any) => ({
          ...log,
          users: Array.isArray(log.users) ? log.users[0] : log.users,
        }))
      );
    } catch (error) {
      console.error("Error approving story:", error);
    }
  };

  const statsCards = [
    {
      title: "Total Platform Raised",
      value: `₹${stats.totalRaised.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Donations",
      value: stats.totalDonations.toString(),
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Pending NGO Approvals",
      value: pendingNGOs.length.toString(),
      icon: Shield,
      color: "text-orange-600",
    },
    {
      title: "Pending Stories",
      value: pendingStories.length.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
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
                    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ngos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="ngos">NGO Approvals</TabsTrigger>
            <TabsTrigger value="stories">Story Approvals</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          {/* NGO Approvals */}
          <TabsContent value="ngos">
            <Card>
              <CardHeader>
                <CardTitle>Pending NGOs</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingNGOs.map((ngo) => (
                      <TableRow key={ngo.id}>
                        <TableCell>{ngo.name}</TableCell>
                        <TableCell>{ngo.category}</TableCell>
                        <TableCell>{ngo.email}</TableCell>
                        <TableCell>
                          {new Date(ngo.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleVerifyNGO(ngo.id)}
                          >
                            Verify
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Story Approvals */}
          <TabsContent value="stories">
            <Card>
              <CardHeader>
                <CardTitle>Pending Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>NGO</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingStories.map((story) => (
                      <TableRow key={story.id}>
                        <TableCell>{story.title}</TableCell>
                        <TableCell>{story.ngo_id?.name}</TableCell>
                        <TableCell>
                          {new Date(story.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleApproveStory(story.id)}
                          >
                            Approve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.entity}</TableCell>
                        <TableCell>{log.status}</TableCell>
                        <TableCell>{log.users?.name}</TableCell>
                        <TableCell>
                          {new Date(log.created_at).toLocaleString()}
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
  );
}
