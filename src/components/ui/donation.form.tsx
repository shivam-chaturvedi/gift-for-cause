import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface NGO {
  id: string;
  name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_holder_name: string;
  qr_code_url: string;
  donation_link: string | null;
}

interface Donation {
  amount: number;
  name: string;
  email: string;
  wishlist_id?: string | null;
  user_id?: string | null;
  status: string;
}

const ManualDonationForm = ({
  ngoId,
  userId,
  ngoName,
  donorName,
  donorEmail,
  totalAmount,
}: {
  ngoId: string;
  userId?: string;
  ngoName?: string;
  donorName?: string;
  donorEmail?: string;
  totalAmount?: number;
}) => {
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [donation, setDonation] = useState<Partial<Donation>>({
    status: "pending",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchNGO = async () => {
      const { data, error } = await supabase
        .from("ngo_bank_details")
        .select("*")
        .eq("ngo_id", ngoId)
        .single();
      if (error) return console.error(error);
      setNgo(data as NGO);
    };
    fetchNGO();
  }, [ngoId]);

  const handleSubmit = async () => {
    if (!donation.amount || !donation.name || !donation.email) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("donations").insert([
        {
          user_id: userId || null,
          wishlist_id: donation.wishlist_id || null,
          amount: donation.amount,
          name: donation.name,
          email: donation.email,
          status: "completed",
        },
      ]);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Donation recorded successfully",
      });
      setShowModal(false);
      setDonation({ status: "pending" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (!ngo) return <p>Loading NGO details...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Donate to {ngoName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Use the bank details below to donate manually:</p>
          <p>
            <strong>Account Holder:</strong> {ngo.account_holder_name}
          </p>
          <p>
            <strong>Account Number:</strong> {ngo.account_number}
          </p>
          <p>
            <strong>Bank Name:</strong> {ngo.bank_name}
          </p>
          <p>
            <strong>IFSC:</strong> {ngo.ifsc_code}
          </p>

          {ngo.qr_code_url && (
            <img
              src={ngo.qr_code_url}
              alt="QR Code"
              className="w-48 h-48 mt-4 mx-auto object-contain border rounded"
            />
          )}

          {ngo.donation_link && (
            <a
              href={ngo.donation_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-primary underline mt-2"
            >
              Donation Link
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualDonationForm;
