# Gift for a Cause - Setup Instructions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd give-joy-together-main
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Payment Gateway Keys (Optional for demo)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Set Up Database

1. Go to your Supabase project SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL to create all tables, policies, and seed data

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── dashboard/          # Dashboard components
│   ├── layout/            # Header, Footer
│   ├── payment/           # Payment forms
│   ├── sections/          # Homepage sections
│   └── ui/               # ShadCN UI components
├── contexts/             # React contexts
├── hooks/               # Custom hooks
├── lib/                 # Utilities and API
├── pages/               # Page components
└── assets/              # Images and static files
```

## 🔧 Configuration

### Supabase Setup

1. **Authentication**: Enable Email/Password auth in Supabase Auth settings
2. **Row Level Security**: All tables have RLS enabled with appropriate policies
3. **Storage**: Set up storage buckets for NGO logos and story images

### Payment Integration

The app includes mock payment processing for development. For production:

1. **Stripe**: Set up Stripe account and add webhook endpoints
2. **PayPal**: Configure PayPal Business account
3. **Razorpay**: Set up Razorpay merchant account

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | No |
| `VITE_PAYPAL_CLIENT_ID` | PayPal client ID | No |
| `VITE_RAZORPAY_KEY_ID` | Razorpay key ID | No |

## 🎯 Features

### For Donors
- Browse wishlists by category
- Make secure donations
- Track donation history
- Download receipts
- View impact stories

### For NGOs
- Create and manage wishlists
- Track donations received
- Submit success stories
- View analytics dashboard

### For Admins
- Approve NGO registrations
- Review success stories
- Monitor platform metrics
- View audit logs

## 🔐 Authentication & Authorization

### User Roles
- `donor`: Can browse and donate
- `ngo_owner`: Can manage NGO profile and wishlists
- `ngo_editor`: Can edit NGO content
- `moderator`: Can approve content
- `admin`: Full platform access

### Row Level Security Policies
- Users can only view their own data
- NGOs can only manage their own content
- Admins can view all data
- Public content is accessible to everyone

## 🎨 Customization

### Colors
The app uses a warm color palette:
- Primary: Coral (#FF6B6B)
- Secondary: Teal (#20B2AA)
- Accent: Golden Yellow (#FFD93D)

### Styling
- Tailwind CSS for styling
- Framer Motion for animations
- ShadCN UI components
- Dark/Light mode support

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🔍 Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify your environment variables
   - Check if your Supabase project is active

2. **Payment Processing Fails**
   - The app uses mock payments in development
   - Check browser console for errors

3. **Authentication Issues**
   - Clear browser cache
   - Check Supabase Auth settings

4. **Build Errors**
   - Run `npm install` to ensure all dependencies
   - Check Node.js version (18+ required)

### Support
- Check the browser console for detailed error messages
- Verify all environment variables are set correctly
- Ensure Supabase database schema is properly set up

## 📝 License

This project is licensed under the MIT License.
