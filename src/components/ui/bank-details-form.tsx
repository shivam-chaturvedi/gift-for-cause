import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useToast } from "./use-toast";

type Props = {
  ngoId: number | string;
  onSuccess?: () => void;
  onClose: () => void;
  initialData?: any;
};

export default function NgoBankDetailsForm({
  ngoId,
  onSuccess,
  onClose,
  initialData,
}: Props) {
  const { toast } = useToast();
  const [accountHolderName, setAccountHolderName] = useState(
    initialData?.account_holder_name || ""
  );
  const [accountNumber, setAccountNumber] = useState(
    initialData?.account_number || ""
  );
  const [ifscCode, setIfscCode] = useState(initialData?.ifsc_code || "");
  const [bankName, setBankName] = useState(initialData?.bank_name || "");
  const [branchName, setBranchName] = useState(initialData?.branch_name || "");
  const [upiId, setUpiId] = useState(initialData?.upi_id || "");
  const [donationLink, setDonationLink] = useState(
    initialData?.donation_link || ""
  );
  const [paymentMethods, setPaymentMethods] = useState(
    JSON.stringify(initialData?.payment_methods) || "{}"
  );
  const [qrFile, setQrFile] = useState<File | null>(
    initialData?.qr_code_url ? null : null
  );
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setQrFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  async function uploadQrAndGetUrl(file: File) {
    const bucket = "qr_codes";
    const fileExt = file.name.split(".").pop();
    const filePath = `${ngoId}/qr_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicUrl;
  }
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Check if bank details are filled
    const bankDetailsFilled = accountHolderName && accountNumber && ifscCode && bankName && branchName;
    
    // Check if UPI details are filled
    const upiDetailsFilled = upiId && qrFile;

    // Either bank details OR UPI details must be filled
    if (!bankDetailsFilled && !upiDetailsFilled) {
      toast({
        title: "Missing Required Information",
        description: "Please fill either Bank Account Details OR UPI/QR Code details",
        variant: "destructive",
      });
      return;
    }

    const missingFields: string[] = [];
    
    // If bank details are partially filled, require all bank fields
    if (accountHolderName || accountNumber || ifscCode || bankName || branchName) {
      if (!accountHolderName) missingFields.push("Account Holder Name");
      if (!accountNumber) missingFields.push("Account Number");
      if (!ifscCode) missingFields.push("IFSC Code");
      if (!bankName) missingFields.push("Bank Name");
      if (!branchName) missingFields.push("Branch Name");
    }
    
    // If UPI details are partially filled, require all UPI fields
    if (upiId || qrFile) {
      if (!upiId) missingFields.push("UPI ID");
      if (!qrFile) missingFields.push("QR Code Image");
    }

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill/select the following fields: ${missingFields.join(
          ", "
        )}`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const qr_url = qrFile ? await uploadQrAndGetUrl(qrFile) : null;

      let payment_methods_json = null;
      try {
        payment_methods_json = paymentMethods
          ? JSON.parse(paymentMethods)
          : null;
      } catch {
        payment_methods_json = null;
      }
      const { error, data } = await supabase.from("ngo_bank_details").upsert(
        [
          {
            ngo_id: ngoId,
            account_holder_name: accountHolderName,
            account_number: accountNumber,
            ifsc_code: ifscCode,
            bank_name: bankName,
            branch_name: branchName,
            upi_id: upiId,
            qr_code_url: qr_url,
            donation_link: donationLink || null,
            payment_methods: payment_methods_json,
          },
        ],
        {
          onConflict: "ngo_id",
          ignoreDuplicates: false,
        }
      );

      if (error) {
        console.error("Error upserting NGO bank details:", error);
      } else {
        console.log("NGO bank details saved successfully:", data);
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bank details saved successfully.",
      });

      // Reset form
      setAccountHolderName("");
      setAccountNumber("");
      setIfscCode("");
      setBankName("");
      setBranchName("");
      setUpiId("");
      setDonationLink("");
      setPaymentMethods("{}");
      setQrFile(null);
      onSuccess && onSuccess();
    } catch (err: any) {
      console.error(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to save bank details.",
      });
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="absolute w-full max-w-3xl p-6 ">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>
        <CardHeader>
          <CardTitle>NGO Bank & Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              <strong>Choose one option:</strong> Fill either Bank Account Details OR UPI/QR Code details below
            </p>
          </div>
          
          {/* Bank Account Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Bank Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>
                  Account Holder Name <span className="text-red-500">*</span>
                </Label>
              <Input
                required
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>
                Account Number <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>
                IFSC Code <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>
                Bank Name <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>
                Branch Name <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              />
            </div>
          </div>
          </div>

          {/* Beautiful OR Divider */}
          <div className="relative flex items-center justify-center my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex items-center justify-center bg-white dark:bg-gray-900 px-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                <span className="text-white font-bold text-lg">OR</span>
              </div>
            </div>
          </div>

          {/* UPI/QR Code Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              UPI/QR Code Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>
                  UPI ID <span className="text-red-500">*</span>
                </Label>
              <Input
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="name@bank"
              />
            </div>
            <div className="grid gap-2">
              <Label>Donation / External Link</Label>
              <Input
                value={donationLink}
                onChange={(e) => setDonationLink(e.target.value)}
              />
            </div>
          </div>

            <div>
              <Label>
                QR Code Image <span className="text-red-500">*</span>
              </Label>
              <div
                {...getRootProps()}
                className={`border-dashed border-2 rounded p-6 text-center cursor-pointer hover:border-gray-400 ${
                  isDragActive ? "border-blue-500" : "border-gray-300"
                }`}
              >
                <input required {...getInputProps()} />
                {qrFile ? (
                  <img
                    src={URL.createObjectURL(qrFile)}
                    alt="QR Preview"
                    className="mx-auto max-h-48 object-contain rounded mb-2"
                  />
                ) : (
                  <p className="text-gray-500">
                    Drag & drop a QR image or click to select
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? "Saving..." : "Save Bank Details"}
            </Button>
            <Button
              onClick={() => {
                setAccountHolderName("");
                setAccountNumber("");
                setIfscCode("");
                setBankName("");
                setBranchName("");
                setUpiId("");
                setDonationLink("");
                setPaymentMethods("{}");
                setQrFile(null);
              }}
              className="w-full"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
