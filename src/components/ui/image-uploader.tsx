import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  initialImage?: string;
}

export default function ImageUploader({ onUploadComplete, initialImage }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(initialImage);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `ngo_images/${fileName}`;

    setUploading(true);

    const { data, error } = await supabase.storage
      .from("ngo_images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error("Upload error:", error);
      setUploading(false);
      return;
    }

    // Get public URL
    const { publicUrl, error: urlError } = supabase.storage
      .from("ngo_images")
      .getPublicUrl(filePath);

    if (urlError) {
      console.error("Public URL error:", urlError);
      setUploading(false);
      return;
    }

    setPreview(publicUrl);
    onUploadComplete(publicUrl); // Pass URL back to parent form
    setUploading(false);
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] } });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
        isDragActive ? "border-primary bg-primary/10" : "border-border bg-card"
      )}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <div className="flex flex-col items-center justify-center space-y-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Uploading...</p>
        </div>
      ) : preview ? (
        <img src={preview} alt="Preview" className="mx-auto max-h-48 object-contain rounded-md" />
      ) : (
        <p>Drag & drop an image here, or click to select</p>
      )}
    </div>
  );
}
