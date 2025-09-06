import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface SuccessStoryFormProps {
  ngo: any;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function SuccessStoryForm({
  ngo,
  onSuccess,
  onClose,
}: SuccessStoryFormProps) {
  const [form, setForm] = useState({
    title: "",
    story_text: "",
    impact_metrics: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreviewUrl(URL.createObjectURL(uploadedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
      "video/*": [],
    },
    maxFiles: 1,
    onDrop,
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      let media_url = null;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("success_stories")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData, error: urlError } = supabase.storage
          .from("success_stories")
          .getPublicUrl(fileName);

        if (urlError) throw urlError;
        media_url = urlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from("success_stories")
        .insert([
          {
            ngo_id: ngo?.id,
            title: form.title,
            story_text: form.story_text,
            impact_metrics: form.impact_metrics,
            media_url,
          },
        ]);

      if (insertError) throw insertError;

      setForm({ title: "", story_text: "", impact_metrics: "" });
      setFile(null);
      setPreviewUrl(null);

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Error submitting story:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white  p-4 border rounded-lg space-y-4 w-11/12 lg:w-1/2  absolute z-20 top-1/4 left-1/2 -translate-x-1/2 shadow-lg">
      {/* Close Button (Top Right) */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
      >
        <X className="h-6 w-6" />
      </button>
      <h2 className="text-xl font-bold">Submit Success Story</h2>
      {error && <p className="text-red-600">{error}</p>}

      {/* Title */}
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter story title"
        />
      </div>

      {/* Story */}
      <div className="grid gap-2">
        <Label htmlFor="story_text">Story Text</Label>
        <Textarea
          id="story_text"
          value={form.story_text}
          onChange={(e) => setForm({ ...form, story_text: e.target.value })}
          rows={4}
          placeholder="Tell the impact story..."
        />
      </div>

      {/* Impact Metrics */}
      <div className="grid gap-2">
        <Label htmlFor="impact_metrics">Impact Metrics</Label>
        <Input
          id="impact_metrics"
          value={form.impact_metrics}
          onChange={(e) => setForm({ ...form, impact_metrics: e.target.value })}
          placeholder="e.g., 500 families served, 90% improvement"
        />
      </div>

      {/* Drag & Drop Upload */}
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {previewUrl ? (
          <div className="relative w-full">
            {file?.type.startsWith("image/") ? (
              <img
                loading="lazy"
                src={previewUrl}
                alt="preview"
                className="max-h-60 w-full object-contain rounded-lg"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                className="max-h-60 w-full object-contain rounded-lg"
              />
            )}
            <button
              type="button"
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreviewUrl(null);
              }}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <Upload className="w-10 h-10 mb-2" />
            <p className="text-sm">
              {isDragActive
                ? "Drop your media here..."
                : "Drag & drop image/video or click to select"}
            </p>
          </div>
        )}
      </div>

      {/* Submit */}
      <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Story"}
      </Button>
    </div>
  );
}
