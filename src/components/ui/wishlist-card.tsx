import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, MapPin, Users, Trash2, Package, ChevronDown, ChevronUp, Edit } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WishlistCardProps {
  id: string;
  title: string;
  description: string;
  ngo_name: string;
  location: string;
  target_amount: number;
  raised_amount: number;
  image: string;
  urgent?: boolean;
  showDeleteButton?: boolean;
  onDelete?: (wishlistId: string) => void;
  isNGODashboard?: boolean;
  wishlist_items?: Array<{
    id: string;
    name: string;
    price: number;
    qty: number;
    funded_qty: number;
  }>;
  onManageItems?: (wishlistId: string) => void;
  onEdit?: (wishlistId: string) => void;
}

export function WishlistCard({
  id,
  title,
  description,
  ngo_name,
  location,
  target_amount,
  raised_amount,
  image,
  urgent = false,
  showDeleteButton = false,
  onDelete,
  isNGODashboard = false,
  wishlist_items = [],
  onManageItems,
  onEdit,
}: WishlistCardProps) {
  const [showItems, setShowItems] = useState(false);
  const progress =
    target_amount > 0 ? (raised_amount / target_amount) * 100 : 0;
  const remaining = target_amount - raised_amount;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-strong border border-border/50"
    >
      {/* Top Right Badges */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {urgent && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Badge
              variant="destructive"
              className="bg-destructive text-destructive-foreground"
            >
              Urgent
            </Badge>
          </motion.div>
        )}

        {/* Delete Button */}
        {showDeleteButton && onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.2 }}
                className="p-2 rounded-full bg-destructive/80 backdrop-blur-sm hover:bg-destructive transition-colors"
              >
            
                <Trash2 className="w-4 h-4 text-destructive-foreground" />
              </motion.button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Wishlist</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{title}"? This action cannot be undone.
                  All associated donations and data will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Wishlist
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          loading="lazy"
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Heart Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 left-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart className="w-4 h-4 text-muted-foreground hover:text-primary" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        {/* NGO Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{ngo_name}</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ₹{raised_amount?.toLocaleString()} raised
            </span>
            <span className="font-medium text-foreground">
              ₹{Math.max(target_amount - raised_amount, 0).toLocaleString()}{" "}
              needed
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {progress.toFixed(0)}% funded
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          {isNGODashboard ? (
            <>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  if (onManageItems) {
                    onManageItems(id);
                  } else {
                    setShowItems(!showItems);
                  }
                }}
              >
                <Package className="w-4 h-4 mr-2" />
                Manage Items
                {!onManageItems && (showItems ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />)}
              </Button>
              {onEdit && (
                <Button 
                  variant="outline" 
                  onClick={() => onEdit(id)}
                  className="px-3"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="hero" className="flex-1" asChild>
                <Link to={`/donate/${id}`}>Donate Now</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/wishlist/${id}`}>View Details</Link>
              </Button>
            </>
          )}
        </div>

        {/* Items List - Only show in NGO dashboard when expanded */}
        {isNGODashboard && showItems && wishlist_items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2 border-t pt-4"
          >
            <h4 className="text-sm font-semibold text-foreground mb-2">Wishlist Items</h4>
            {wishlist_items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-sm bg-muted/50 rounded-lg p-3"
              >
                <div className="flex-1">
                  <span className="font-medium">{item.name}</span>
                  <p className="text-xs text-muted-foreground">₹{item.price}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">
                    {item.funded_qty}/{item.qty}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {item.funded_qty >= item.qty ? "Complete" : "Pending"}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
