import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, X } from "lucide-react";

interface WishlistItem {
  name: string;
  price: number;
  qty: number;
}

interface WishlistFormProps {
  ngo: any;
  onClose: () => void;
}

export function WishlistForm({ ngo, onClose }: WishlistFormProps) {
  const [wishlistData, setWishlistData] = useState({
    title: "",
    description: "",
    target_amount: 0,
    status: "draft",
    urgent: false,
    image: "",
    ngo_name: ngo?.name || "",
    location: ngo?.location || "",
    raised_amount: 0,
  });

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Update target_amount automatically
  useEffect(() => {
    const total = wishlistItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    setWishlistData((prev) => ({ ...prev, target_amount: total }));
  }, [wishlistItems]);

  // Drag & Drop Handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAddItem = () => {
    setWishlistItems([...wishlistItems, { name: "", price: 0, qty: 1 }]);
  };

  const handleItemChange = (
    index: number,
    field: keyof WishlistItem,
    value: string | number
  ) => {
    const newItems = [...wishlistItems];
    newItems[index][field] = field === "name" ? value : Number(value);
    setWishlistItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = wishlistItems.filter((_, i) => i !== index);
    setWishlistItems(newItems);
  };

  const handleImageUpload = async (file: File) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("wishlist-images")
      .upload(fileName, file);
    console.log("Upload data:", data);

    if (error) {
      console.error("Image upload error:", error.message);
      return "";
    }
    const { data: publicUrlData } = supabase.storage
      .from("wishlist-images")
      .getPublicUrl(fileName);

    console.log("Public URL:", publicUrlData);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let imageUrl = wishlistData.image;
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const { data: wishlistCreated, error: wishlistError } = await supabase
        .from("wishlists")
        .insert([
          {
            ...wishlistData,
            ngo_id: ngo.id,
            image: imageUrl,
          },
        ])
        .select()
        .single();

      if (wishlistError) throw wishlistError;

      const wishlistId = wishlistCreated.id;

      const itemsToInsert = wishlistItems.map((item) => ({
        wishlist_id: wishlistId,
        name: item.name,
        price: item.price,
        qty: item.qty,
        funded_qty: 0,
      }));

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from("wishlist_items")
          .insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      setWishlistData({
        title: "",
        description: "",
        target_amount: 0,
        status: "draft",
        urgent: false,
        image: "",
        ngo_name: ngo?.name || "",
        location: ngo?.location || "",
        raised_amount: 0,
      });
      setWishlistItems([]);
      setImageFile(null);
      setImagePreview(null);

      alert("Wishlist created successfully!");
    } catch (error) {
      console.error("Error creating wishlist:", error);
      alert("Failed to create wishlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate "raised" progress dynamically (sum of item prices as placeholder)
  const raisedAmount = wishlistItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const progressPercentage =
    wishlistData.target_amount > 0
      ? Math.min((raisedAmount / wishlistData.target_amount) * 100, 100)
      : 0;

  return (
    <Card className="max-w-3xl mx-auto w-11/12 lg:w-1/2   absolute z-20 top-24 left-1/2 -translate-x-1/2 shadow-lg">
      {/* Close Button (Top Right) */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
      >
        <X className="h-6 w-6" />
      </button>
      <CardHeader>
        <CardTitle>Create a Wishlist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title */}
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={wishlistData.title}
            onChange={(e) =>
              setWishlistData({ ...wishlistData, title: e.target.value })
            }
            placeholder="Enter wishlist title"
          />
        </div>

        {/* Description */}
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={wishlistData.description}
            onChange={(e) =>
              setWishlistData({ ...wishlistData, description: e.target.value })
            }
            placeholder="Enter description"
          />
        </div>

        {/* Target Amount (live-update) */}
        <div className="grid gap-2">
          <Label htmlFor="target">Target Amount ($)</Label>
          <Input
            type="number"
            id="target"
            value={wishlistData.target_amount}
            onChange={(e) =>
              setWishlistData({
                ...wishlistData,
                target_amount: Number(e.target.value),
              })
            }
            placeholder="0"
            readOnly
          />
          <p className="text-sm text-gray-500">
            Total is calculated from all wishlist items
          </p>
        </div>

        {/* Real-time Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          Raised: ${raisedAmount} / ${wishlistData.target_amount}
        </p>

        {/* Urgent */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="urgent"
            checked={wishlistData.urgent}
            onChange={(e) =>
              setWishlistData({ ...wishlistData, urgent: e.target.checked })
            }
          />
          <Label htmlFor="urgent">Mark as urgent</Label>
        </div>

        {/* Image Upload */}
        <div>
          <Label>Upload Image</Label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="mx-auto max-h-48 object-cover rounded"
              />
            ) : (
              <p className="text-gray-500">
                Drag & drop an image or click to select
              </p>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleImageSelect(e.target.files[0])
              }
            />
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Wishlist Items</h3>
            <Button onClick={handleAddItem}>Add Item</Button>
          </div>

          {wishlistItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 border rounded p-3"
            >
              <Input
                placeholder="Item Name"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
                className="w-24"
              />
              <Input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                className="w-20"
              />
              <Button
                variant="destructive"
                onClick={() => handleRemoveItem(index)}
                className="ml-auto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Creating..." : "Create Wishlist"}
        </Button>
      </CardContent>
    </Card>
  );
}
