"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DocViewerProps {
  docUrl: string | null;
  label?: string;
  open: boolean;
  onClose: () => void;
}

const DocViewer: React.FC<DocViewerProps> = ({
  docUrl,
  label,
  open,
  onClose,
}) => {
  if (!docUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{label || "Document Viewer"}</DialogTitle>
          <DialogDescription>
            Preview or download the uploaded document.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between border rounded-md p-3">
          <span className="font-medium">{label || "Document"}</span>
          <div className="flex gap-2">
            {/* Preview in new tab */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(docUrl, "_blank")}
            >
              Preview
            </Button>
            {/* Direct download */}
            <a
              href={docUrl}
              download
              className="px-3 py-1 text-sm rounded-md border bg-primary text-white hover:bg-primary/90"
            >
              Download
            </a>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocViewer;
