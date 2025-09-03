-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('donor', 'ngo_owner', 'ngo_editor', 'moderator', 'admin');
CREATE TYPE wishlist_status AS ENUM ('draft', 'pending', 'published', 'completed');
CREATE TYPE item_status AS ENUM ('available', 'funded', 'out_of_stock');
CREATE TYPE donation_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_gateway AS ENUM ('stripe', 'paypal', 'razorpay');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'donor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avatar_url TEXT,
  phone TEXT,
  address TEXT
);

-- NGOs table
CREATE TABLE ngos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  reg_no TEXT UNIQUE NOT NULL,
  mission TEXT NOT NULL,
  category TEXT NOT NULL,
  logo TEXT,
  docs TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  founded_year INTEGER,
  team_size INTEGER
);

-- Wishlists table
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ngo_id UUID REFERENCES ngos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status wishlist_status DEFAULT 'draft',
  occasion_tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  target_amount DECIMAL(10,2),
  deadline DATE,
  featured BOOLEAN DEFAULT FALSE
);

-- Wishlist items table
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  qty INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  vendor_url TEXT,
  rationale TEXT,
  image_url TEXT,
  status item_status DEFAULT 'available',
  description TEXT,
  funded_qty INTEGER DEFAULT 0
);

-- Donations table
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ngo_id UUID REFERENCES ngos(id) ON DELETE CASCADE,
  wishlist_item_id UUID REFERENCES wishlist_items(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  gateway payment_gateway NOT NULL,
  txn_id TEXT UNIQUE,
  status donation_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  receipt_url TEXT,
  anonymous BOOLEAN DEFAULT FALSE
);

-- Success stories table
CREATE TABLE success_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ngo_id UUID REFERENCES ngos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  story_text TEXT NOT NULL,
  media_url TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  impact_metrics TEXT,
  featured BOOLEAN DEFAULT FALSE
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  details JSONB
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_ngos_slug ON ngos(slug);
CREATE INDEX idx_ngos_verified ON ngos(verified);
CREATE INDEX idx_wishlists_ngo_id ON wishlists(ngo_id);
CREATE INDEX idx_wishlists_status ON wishlists(status);
CREATE INDEX idx_wishlists_featured ON wishlists(featured);
CREATE INDEX idx_wishlist_items_wishlist_id ON wishlist_items(wishlist_id);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_ngo_id ON donations(ngo_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_success_stories_ngo_id ON success_stories(ngo_id);
CREATE INDEX idx_success_stories_approved ON success_stories(approved);
CREATE INDEX idx_success_stories_featured ON success_stories(featured);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- NGOs policies
CREATE POLICY "Anyone can view verified NGOs" ON ngos
  FOR SELECT USING (verified = true);

CREATE POLICY "NGO owners can view their own NGO" ON ngos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ngo_owner', 'ngo_editor')
    )
  );

CREATE POLICY "NGO owners can update their own NGO" ON ngos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ngo_owner', 'ngo_editor')
    )
  );

CREATE POLICY "Admins can view all NGOs" ON ngos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Wishlists policies
CREATE POLICY "Anyone can view published wishlists" ON wishlists
  FOR SELECT USING (status = 'published');

CREATE POLICY "NGO owners can manage their wishlists" ON wishlists
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ngo_owner', 'ngo_editor')
    )
  );

CREATE POLICY "Admins can view all wishlists" ON wishlists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Wishlist items policies
CREATE POLICY "Anyone can view items from published wishlists" ON wishlist_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM wishlists WHERE id = wishlist_id AND status = 'published'
    )
  );

CREATE POLICY "NGO owners can manage their wishlist items" ON wishlist_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ngo_owner', 'ngo_editor')
    )
  );

-- Donations policies
CREATE POLICY "Donors can view their own donations" ON donations
  FOR SELECT USING (donor_id = auth.uid());

CREATE POLICY "NGO owners can view donations to their NGO" ON donations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ngo_owner', 'ngo_editor')
    )
  );

CREATE POLICY "Anyone can create donations" ON donations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all donations" ON donations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Success stories policies
CREATE POLICY "Anyone can view approved success stories" ON success_stories
  FOR SELECT USING (approved = true);

CREATE POLICY "NGO owners can manage their success stories" ON success_stories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ngo_owner', 'ngo_editor')
    )
  );

CREATE POLICY "Admins can view all success stories" ON success_stories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Audit logs policies
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Seed data

-- Insert admin user
INSERT INTO users (id, name, email, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Admin User', 'admin@giftforacause.com', 'admin');

-- Insert sample NGOs
INSERT INTO ngos (id, name, reg_no, mission, category, logo, verified, slug, description, website, contact_email, contact_phone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Clean Water Initiative', 'CWI2024001', 'Providing clean drinking water to rural communities', 'Environment', '/api/placeholder/150/150', true, 'clean-water-initiative', 'We work to provide sustainable clean water solutions to underserved communities across the country.', 'https://cleanwater.org', 'contact@cleanwater.org', '+1-555-0101'),
('550e8400-e29b-41d4-a716-446655440002', 'Education for All', 'EFA2024002', 'Ensuring quality education for every child', 'Education', '/api/placeholder/150/150', true, 'education-for-all', 'Dedicated to breaking barriers to education and creating opportunities for children from marginalized communities.', 'https://educationforall.org', 'info@educationforall.org', '+1-555-0102'),
('550e8400-e29b-41d4-a716-446655440003', 'Healthcare Heroes', 'HH2024003', 'Providing medical care to remote areas', 'Healthcare', '/api/placeholder/150/150', true, 'healthcare-heroes', 'Bringing essential healthcare services to remote and underserved communities through mobile clinics and telemedicine.', 'https://healthcareheroes.org', 'hello@healthcareheroes.org', '+1-555-0103'),
('550e8400-e29b-41d4-a716-446655440004', 'Women Empowerment Network', 'WEN2024004', 'Empowering women through skill development', 'Women Empowerment', '/api/placeholder/150/150', true, 'women-empowerment-network', 'Supporting women''s economic independence through vocational training, microfinance, and community support programs.', 'https://womenempower.org', 'connect@womenempower.org', '+1-555-0104'),
('550e8400-e29b-41d4-a716-446655440005', 'Solar Light Project', 'SLP2024005', 'Bringing renewable energy to rural homes', 'Environment', '/api/placeholder/150/150', true, 'solar-light-project', 'Providing solar-powered lighting solutions to rural households, improving safety and enabling children to study after dark.', 'https://solarlight.org', 'info@solarlight.org', '+1-555-0105');

-- Insert sample wishlists
INSERT INTO wishlists (id, ngo_id, title, status, occasion_tags, description, target_amount, deadline, featured) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Clean Water for 1000 Families', 'published', ARRAY['emergency', 'health'], 'Help us provide clean water access to 1000 families in rural communities', 50000.00, '2024-12-31', true),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', 'School Supplies for 500 Students', 'published', ARRAY['education', 'back-to-school'], 'Provide essential school supplies to 500 students in need', 15000.00, '2024-08-15', true),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', 'Medical Equipment for Mobile Clinic', 'published', ARRAY['healthcare', 'emergency'], 'Equip our mobile clinic with essential medical equipment', 25000.00, '2024-10-30', false),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440004', 'Sewing Machines for Women''s Cooperative', 'published', ARRAY['women-empowerment', 'livelihood'], 'Support women''s economic independence through sewing training', 8000.00, '2024-09-20', false),
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440005', 'Solar Lamps for Rural Homes', 'published', ARRAY['environment', 'energy'], 'Provide solar-powered lighting to 200 rural households', 12000.00, '2024-11-15', true);

-- Insert sample wishlist items
INSERT INTO wishlist_items (id, wishlist_id, name, qty, price, vendor_url, rationale, image_url, description) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', 'Water Purification System', 10, 5000.00, 'https://example.com/water-system', 'Each system can purify water for 100 families', '/api/placeholder/300/200', 'Advanced water purification systems for community use'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440010', 'Water Storage Tanks', 20, 250.00, 'https://example.com/water-tanks', 'Safe storage for purified water', '/api/placeholder/300/200', 'Large capacity water storage tanks'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440011', 'School Backpacks', 500, 30.00, 'https://example.com/backpacks', 'Durable backpacks for daily use', '/api/placeholder/300/200', 'High-quality school backpacks with multiple compartments'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440011', 'Notebooks and Stationery Sets', 500, 15.00, 'https://example.com/stationery', 'Complete stationery for academic year', '/api/placeholder/300/200', 'Complete stationery sets including notebooks, pens, and pencils'),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440012', 'Portable Ultrasound Machine', 1, 15000.00, 'https://example.com/ultrasound', 'Essential for prenatal care in remote areas', '/api/placeholder/300/200', 'Portable ultrasound machine for mobile healthcare'),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440012', 'First Aid Kits', 50, 200.00, 'https://example.com/first-aid', 'Emergency medical supplies', '/api/placeholder/300/200', 'Comprehensive first aid kits for emergency situations'),
('550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440013', 'Sewing Machines', 20, 400.00, 'https://example.com/sewing-machines', 'Enable women to start their own businesses', '/api/placeholder/300/200', 'Professional sewing machines for skill development'),
('550e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440014', 'Solar LED Lamps', 200, 60.00, 'https://example.com/solar-lamps', 'Clean energy lighting for rural homes', '/api/placeholder/300/200', 'Solar-powered LED lamps for sustainable lighting');

-- Insert sample donations
INSERT INTO donations (id, donor_id, ngo_id, wishlist_item_id, amount, gateway, txn_id, status) VALUES
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440020', 5000.00, 'stripe', 'txn_001', 'completed'),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440022', 1500.00, 'paypal', 'txn_002', 'completed'),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440027', 1200.00, 'razorpay', 'txn_003', 'completed');

-- Insert sample success stories
INSERT INTO success_stories (id, ngo_id, title, story_text, media_url, approved, impact_metrics, featured) VALUES
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440001', 'Clean Water Transforms Village Life', 'The installation of water purification systems in rural villages has dramatically improved health outcomes. Children are no longer falling sick from waterborne diseases, and women no longer need to walk miles to fetch water.', '/api/placeholder/400/300', true, '1000+ families served, 90% reduction in waterborne diseases', true),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440002', 'Education Opens New Doors', 'Through our school supplies program, 500 children now have the tools they need to succeed in school. Many have improved their grades and are dreaming of higher education.', '/api/placeholder/400/300', true, '500 students supported, 85% improvement in attendance', true),
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440004', 'Women Build Sustainable Livelihoods', 'Our sewing machine program has empowered 20 women to start their own businesses. They are now earning sustainable incomes and supporting their families.', '/api/placeholder/400/300', true, '20 women empowered, $500 average monthly income increase', true),
('550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440005', 'Solar Light Brightens Future', 'Solar lamps have transformed evening activities in rural homes. Children can now study after dark, and families feel safer with reliable lighting.', '/api/placeholder/400/300', true, '200 households illuminated, 3 hours additional study time', true),
('550e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440003', 'Mobile Clinic Saves Lives', 'Our mobile clinic equipped with essential medical equipment has provided healthcare to remote communities, saving lives and improving health outcomes.', '/api/placeholder/400/300', true, '5000+ patients treated, 95% patient satisfaction', true);

-- Insert sample audit logs
INSERT INTO audit_logs (id, user_id, action, entity, status, details) VALUES
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440000', 'donation_created', 'donations', 'success', '{"amount": 5000, "ngo_id": "550e8400-e29b-41d4-a716-446655440001"}'),
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440000', 'ngo_verified', 'ngos', 'success', '{"ngo_id": "550e8400-e29b-41d4-a716-446655440001"}'),
('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440000', 'story_approved', 'success_stories', 'success', '{"story_id": "550e8400-e29b-41d4-a716-446655440040"}');
