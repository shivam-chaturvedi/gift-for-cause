// components/ui/file-drag-drop-uploader.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Upload, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  bucket?: string; // default ngo_documents
}

const FileDragDropUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  bucket = "ngo_documents",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      setFileName(file.name);

      const filePath = `docs/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

      onUploadComplete(data.publicUrl);
    } catch (err: any) {
      console.error("Upload failed:", err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
        dragActive
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      {uploading ? (
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      ) : (
        <>
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag & drop your file here, or{" "}
            <span className="text-primary">browse</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supported: PNG, JPG, PDF, DOCX
          </p>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
            onChange={handleChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </>
      )}

      {fileName && !uploading && (
        <div className="mt-3 flex items-center justify-center space-x-2 text-sm font-medium">
          {fileName.match(/\.(jpg|jpeg|png)$/i) ? (
            <ImageIcon className="h-4 w-4 text-primary" />
          ) : (
            <FileText className="h-4 w-4 text-primary" />
          )}
          <span>{fileName}</span>
        </div>
      )}
    </motion.div>
  );
};

export default FileDragDropUploader;
