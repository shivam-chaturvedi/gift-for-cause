import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Check if using placeholder values
const isUsingPlaceholders = supabaseUrl.includes('your-project') || 
                           supabaseUrl.includes('placeholder') || 
                           supabaseAnonKey.includes('your-anon-key') || 
                           supabaseAnonKey.includes('placeholder')

if (isUsingPlaceholders) {
  console.error('Supabase configuration missing. Please set up your environment variables.')
  console.log('1. Create a .env file in the root directory')
  console.log('2. Add your Supabase URL and anon key from your Supabase project settings')
  console.log('3. Restart the development server')
}

// Create a mock client if using placeholders to prevent crashes
export const supabase = isUsingPlaceholders 
  ? createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false }
    })
  : createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  name: string
  email: string
  role: 'donor' | 'ngo_owner' | 'ngo_editor' | 'moderator' | 'admin'
  created_at: string
}

export interface NGO {
  id: string
  name: string
  reg_no: string
  mission: string
  category: string
  logo: string
  docs: string[]
  verified: boolean
  created_at: string
  slug: string
  description: string
  website: string
  contact_email: string
  contact_phone: string
}

export interface Wishlist {
  id: string
  ngo_id: string
  title: string
  status: 'draft' | 'pending' | 'published' | 'completed'
  occasion_tags: string[]
  created_at: string
  description: string
  target_amount: number
  deadline: string
}

export interface WishlistItem {
  id: string
  wishlist_id: string
  name: string
  qty: number
  price: number
  vendor_url: string
  rationale: string
  image_url: string
  status: 'available' | 'funded' | 'out_of_stock'
  description: string
}

export interface Donation {
  id: string
  donor_id: string
  ngo_id: string
  wishlist_item_id: string
  amount: number
  gateway: 'stripe' | 'paypal' | 'razorpay'
  txn_id: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  created_at: string
}

export interface SuccessStory {
  id: string
  ngo_id: string
  title: string
  story_text: string
  media_url: string
  approved: boolean
  created_at: string
  impact_metrics: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  entity: string
  status: string
  created_at: string
  details: any
}