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
import DocViewer from "../ui/doc-viewer";

interface PendingNGO {
  document_url: ReactNode;
  id: string;
  name: string;
  category: string;
  email: string;
  created_at: string;
  image: string;
  location: string;
  established_year: string;
  website: string;
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
  const [selectedNGO, setSelectedNGO] = useState<any | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: ngosData, error: ngosError } = await supabase
          .from("ngo")
          .select("*")
          .is("verified", null);

        console.log(ngosData);

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

  const handleVerifyNGO = async (ngoId: string, status: boolean) => {
    try {
      const { error } = await supabase
        .from("ngo")
        .update({ verified: status })
        .eq("id", ngoId);

      if (error) throw error;

      // Remove NGO from pending list
      setPendingNGOs((prev) => prev.filter((ngo) => ngo.id !== ngoId));

      // Insert audit log
      await supabase.from("audit_logs").insert({
        user_id: user?.id,
        action: status ? "ngo_approved" : "ngo_rejected",
        entity: "ngo",
        status: status ? "approved" : "rejected",
        details: { ngo_id: ngoId },
      });

      // Show toast depending on action
      toast({
        title: status ? "NGO Approved ✅" : "NGO Rejected ❌",
        description: status
          ? "The NGO has been approved successfully."
          : "The NGO has been rejected.",
        duration: 5000,
      });

      // Refresh audit logs
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

        {selectedNGO && (
          <DocViewer
            docUrl={selectedNGO?.document_url}
            open={selectedNGO}
            onClose={() => setSelectedNGO(null)}
          />
        )}

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
          </TabsList>

          {/* NGO Approvals */}
          <TabsContent value="ngos">
            <Card>
              <CardHeader>
                <CardTitle>NGO Approvals</CardTitle>
                <p className="text-gray-500 text-sm">
                  Review NGO details and documents before approving or
                  rejecting.
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Logo</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Established</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingNGOs.map((ngo) => (
                      <TableRow key={ngo.id} className="hover:bg-gray-50">
                        {/* NGO Image */}
                        <TableCell>
                          {ngo.image ? (
                            <img
                              src={ngo.image}
                              alt={ngo.name}
                              className="h-12 w-12 rounded-full object-cover border"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">
                              No Image
                            </span>
                          )}
                        </TableCell>

                        {/* NGO Info */}
                        <TableCell className="font-semibold">
                          {ngo.name}
                        </TableCell>
                        <TableCell>{ngo.category}</TableCell>
                        <TableCell>{ngo.email}</TableCell>
                        <TableCell>{ngo.location}</TableCell>
                        <TableCell>{ngo.established_year}</TableCell>
                        <TableCell>
                          {ngo.website ? (
                            <a
                              href={ngo.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              {ngo.website.replace(/^https?:\/\//, "")}
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              No Website
                            </span>
                          )}
                        </TableCell>

                        {/* NGO Documents */}
                        <TableCell>
                          {ngo?.document_url ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedNGO(ngo)}
                            >
                              View Documents
                            </Button>
                          ) : (
                            <p> No Documents Found</p>
                          )}
                        </TableCell>

                        {/* Approve / Reject */}
                        <TableCell>
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to approve and verify this NGO?"
                                  )
                                ) {
                                  handleVerifyNGO(ngo.id, true);
                                }
                              }}
                            >
                              Approve
                            </Button>

                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to reject this NGO?"
                                  )
                                ) {
                                  handleVerifyNGO(ngo.id, false);
                                }
                              }}
                            >
                              Reject
                            </Button>
                          </div>
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
                          {new Date(log.created_at).toLocaleDateString()}
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
