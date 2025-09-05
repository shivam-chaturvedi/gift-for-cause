import { supabase, User, NGO, Wishlist, WishlistItem, Donation, SuccessStory } from './supabase'

// -------------------- AUTH API --------------------
export const authAPI = {
  signUp: async (email: string, password: string, name: string, role: string = 'donor') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } }
    });
    if (error) throw error;
    return data.user;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user || null;
  },

  updateProfile: async (updates: Partial<User>) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

// -------------------- NGOS API --------------------
export const ngoAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('ngos')
      .select('*')
      .eq('verified', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('ngos')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (ngo: Omit<NGO, 'id' | 'created_at' | 'verified'>) => {
    const { data, error } = await supabase
      .from('ngos')
      .insert(ngo)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<NGO>) => {
    const { data, error } = await supabase
      .from('ngos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  verify: async (id: string) => {
    const { data, error } = await supabase
      .from('ngos')
      .update({ verified: true })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// -------------------- WISHLISTS API --------------------
export const wishlistAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('wishlists')
      .select(`*, ngos (name, slug, logo)`)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('wishlists')
      .select(`*, ngos (name, slug, logo, description, website, contact_email)`)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  getByNGO: async (ngoId: string) => {
    const { data, error } = await supabase
      .from('wishlists')
      .select('*')
      .eq('ngo_id', ngoId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  create: async (wishlist: Omit<Wishlist, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('wishlists')
      .insert(wishlist)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<Wishlist>) => {
    const { data, error } = await supabase
      .from('wishlists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  publish: async (id: string) => {
    const { data, error } = await supabase
      .from('wishlists')
      .update({ status: 'published' })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// -------------------- WISHLIST ITEMS API --------------------
export const wishlistItemAPI = {
  getByWishlist: async (wishlistId: string) => {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('wishlist_id', wishlistId)
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  },

  create: async (item: Omit<WishlistItem, 'id'>) => {
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<WishlistItem>) => {
    const { data, error } = await supabase
      .from('wishlist_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// -------------------- DONATIONS API --------------------
export const donationAPI = {
  create: async (donation: Omit<Donation, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('donations').insert(donation).select().single();
    if (error) throw error;
    return data;
  },

  getByUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('donations')
      .select(`*, wishlist_items!inner(name, image_url), ngos!inner(name, slug)`)
      .eq('donor_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  updateStatus: async (id: string, status: Donation['status'], txnId?: string) => {
    const updates: Partial<Donation> = { status };
    if (txnId) updates.txn_id = txnId;

    const { data, error } = await supabase
      .from('donations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getStats: async () => {
    const { data, error } = await supabase.from('donations').select('amount, status');
    if (error) throw error;

    const completed = data?.filter(d => d.status === 'completed') || [];
    const totalRaised = completed.reduce((sum, d) => sum + Number(d.amount), 0);
    const totalDonations = completed.length;

    return { totalRaised, totalDonations };
  }
}

// -------------------- SUCCESS STORIES API --------------------
export const successStoryAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('success_stories')
      .select(`*, ngos (name, slug, logo)`)
      .eq('approved', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getByNGO: async (ngoId: string) => {
    const { data, error } = await supabase
      .from('success_stories')
      .select('*')
      .eq('ngo_id', ngoId)
      .eq('approved', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  create: async (story: Omit<SuccessStory, 'id' | 'created_at' | 'approved'>) => {
    const { data, error } = await supabase.from('success_stories').insert(story).select().single();
    if (error) throw error;
    return data;
  },

  approve: async (id: string) => {
    const { data, error } = await supabase
      .from('success_stories')
      .update({ approved: true })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// -------------------- ADMIN API --------------------
export const adminAPI = {
  getPendingNGOs: async () => {
    const { data, error } = await supabase
      .from('ngos')
      .select('*')
      .eq('verified', false)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getAuditLogs: async () => {
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`*, users!inner(name, email)`)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return data;
  },

  createAuditLog: async (log: Omit<any, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('audit_logs').insert(log).select().single();
    if (error) throw error;
    return data;
  }
}

// -------------------- SEARCH API --------------------
export const searchAPI = {
  searchWishlists: async (query: string, category?: string) => {
    let queryBuilder = supabase
      .from('wishlists')
      .select(`*, ngos (name, slug, logo, category)`)
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    if (category) queryBuilder = queryBuilder.eq('ngos.category', category);

    const { data, error } = await queryBuilder.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  searchNGOs: async (query: string) => {
    const { data, error } = await supabase
      .from('ngos')
      .select('*')
      .eq('verified', true)
      .or(`name.ilike.%${query}%,mission.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};
