/**
 * Example usage of the mailer utility
 * This file demonstrates how to use the mailer functions
 */

import { 
  sendEmail, 
  sendWelcomeEmail, 
  sendPasswordResetEmail, 
  sendDonationConfirmationEmail,
  sendNGODonationNotificationEmail 
} from './mailer';

// Example 1: Basic email sending
export const sendBasicEmail = async () => {
  const result = await sendEmail({
    to: 'chaturvedishivam598@gmail.com',
    subject: 'Test Email from Gift for Cause',
    text: 'This is a plain text email from our app.',
    html: '<h1>Hello!</h1><p>This is an HTML email from our app.</p>'
  });

  if (result.success) {
    console.log('Email sent successfully:', result.message);
  } else {
    console.error('Failed to send email:', result.error);
  }
};

// Example 2: Send welcome email after user signup
export const handleUserSignup = async (email: string, name: string, role: 'donor' | 'ngo') => {
  try {
    // Your existing signup logic here...
    
    // Send welcome email
    const emailResult = await sendWelcomeEmail(email, name, role);
    
    if (emailResult.success) {
      console.log('Welcome email sent successfully');
    } else {
      console.error('Failed to send welcome email:', emailResult.error);
    }
  } catch (error) {
    console.error('Signup error:', error);
  }
};

// Example 3: Send password reset email
export const handlePasswordReset = async (email: string) => {
  try {
    // Generate reset link (you can use Supabase's built-in reset or create your own)
    const resetLink = `${window.location.origin}/reset-password?token=your-reset-token`;
    
    const emailResult = await sendPasswordResetEmail(email, resetLink);
    
    if (emailResult.success) {
      console.log('Password reset email sent successfully');
    } else {
      console.error('Failed to send password reset email:', emailResult.error);
    }
  } catch (error) {
    console.error('Password reset error:', error);
  }
};

// Example 4: Send donation confirmation email
export const handleDonation = async (
  donorEmail: string,
  donorName: string,
  amount: number,
  wishlistTitle: string,
  ngoName: string
) => {
  try {
    // Your existing donation processing logic here...
    
    // Send confirmation email to donor
    const donorEmailResult = await sendDonationConfirmationEmail(
      donorEmail,
      donorName,
      amount,
      wishlistTitle,
      ngoName
    );
    
    if (donorEmailResult.success) {
      console.log('Donation confirmation email sent to donor');
    } else {
      console.error('Failed to send donor confirmation email:', donorEmailResult.error);
    }
  } catch (error) {
    console.error('Donation processing error:', error);
  }
};

// Example 5: Send NGO notification for new donation
export const notifyNGOAboutDonation = async (
  ngoEmail: string,
  ngoName: string,
  donorName: string,
  amount: number,
  wishlistTitle: string
) => {
  try {
    const emailResult = await sendNGODonationNotificationEmail(
      ngoEmail,
      ngoName,
      donorName,
      amount,
      wishlistTitle
    );
    
    if (emailResult.success) {
      console.log('NGO notification email sent successfully');
    } else {
      console.error('Failed to send NGO notification email:', emailResult.error);
    }
  } catch (error) {
    console.error('NGO notification error:', error);
  }
};

// Example 6: Integration with your existing auth context
export const enhancedSignup = async (
  email: string,
  password: string,
  name: string,
  role: 'donor' | 'ngo'
) => {
  try {
    // Your existing Supabase signup logic
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Send welcome email after successful signup
    if (data.user) {
      const emailResult = await sendWelcomeEmail(email, name, role);
      
      if (!emailResult.success) {
        console.warn('User created but welcome email failed:', emailResult.error);
      }
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

