/**
 * Email utility for sending emails via Vercel API
 */

export interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Test if the email service is available
 * @returns Promise<boolean> - True if service is available
 */
export const testEmailService = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://mailer-wine-two.vercel.app/send-email', {
      method: 'OPTIONS',
    });
    return response.ok;
  } catch (error) {
    console.warn('Email service test failed:', error);
    return false;
  }
};

/**
 * Send email using the Vercel mailer API
 * @param params - Email parameters including to, subject, text, and html
 * @returns Promise<EmailResponse> - Response indicating success or failure
 */
export const sendEmail = async (params: EmailParams): Promise<EmailResponse> => {
  try {
    console.log('Attempting to send email to:', params.to);
    
    const response = await fetch('https://mailer-wine-two.vercel.app/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html,
      }),
    });

    console.log('Email API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Email API error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Email sent successfully:', data);
    
    return {
      success: true,
      message: data.message || 'Email sent successfully',
    };
  } catch (error: any) {
    console.error('Error sending email:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send email';
    if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Network error: Unable to connect to email service. Please check your internet connection.';
    } else if (error.message.includes('HTTP error')) {
      errorMessage = `Server error: ${error.message}`;
    } else {
      errorMessage = error.message || 'Unknown error occurred';
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Send welcome email to new user
 * @param email - User's email address
 * @param name - User's name
 * @param role - User's role (donor/ngo)
 */
export const sendWelcomeEmail = async (
  email: string,
  name: string,
  role: 'donor' | 'ngo'
): Promise<EmailResponse> => {
  const subject = `Welcome to Gift for Cause, ${name}!`;
  const text = `Hello ${name},\n\nWelcome to Gift for Cause! We're excited to have you join our community of ${role}s making a positive impact.\n\nBest regards,\nThe Gift for Cause Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Welcome to Gift for Cause, ${name}!</h1>
      <p>Hello ${name},</p>
      <p>Welcome to Gift for Cause! We're excited to have you join our community of ${role}s making a positive impact.</p>
      <p>You can now start ${role === 'ngo' ? 'creating wishlists and managing donations' : 'browsing and donating to causes'}.</p>
      <p>Best regards,<br>The Gift for Cause Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};

/**
 * Send password reset email
 * @param email - User's email address
 * @param resetLink - Password reset link
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
): Promise<EmailResponse> => {
  const subject = 'Reset Your Password - Gift for Cause';
  const text = `Hello,\n\nYou requested to reset your password. Click the link below to reset it:\n\n${resetLink}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe Gift for Cause Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Reset Your Password</h1>
      <p>Hello,</p>
      <p>You requested to reset your password. Click the button below to reset it:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
      </div>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>The Gift for Cause Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};

/**
 * Send donation confirmation email
 * @param email - Donor's email address
 * @param donorName - Donor's name
 * @param amount - Donation amount
 * @param wishlistTitle - Title of the wishlist
 * @param ngoName - Name of the NGO
 */
export const sendDonationConfirmationEmail = async (
  email: string,
  donorName: string,
  amount: number,
  wishlistTitle: string,
  ngoName: string
): Promise<EmailResponse> => {
  const subject = `Thank you for your donation - ${wishlistTitle}`;
  const text = `Hello ${donorName},\n\nThank you for your generous donation of ₹${amount} to "${wishlistTitle}" by ${ngoName}.\n\nYour contribution makes a real difference in helping those in need.\n\nBest regards,\nThe Gift for Cause Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #16a34a;">Thank you for your donation!</h1>
      <p>Hello ${donorName},</p>
      <p>Thank you for your generous donation of <strong>₹${amount}</strong> to "<strong>${wishlistTitle}</strong>" by <strong>${ngoName}</strong>.</p>
      <p>Your contribution makes a real difference in helping those in need.</p>
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2563eb;">Donation Details</h3>
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p><strong>Cause:</strong> ${wishlistTitle}</p>
        <p><strong>Organization:</strong> ${ngoName}</p>
      </div>
      <p>Best regards,<br>The Gift for Cause Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};

/**
 * Send NGO notification email for new donation
 * @param email - NGO's email address
 * @param ngoName - NGO's name
 * @param donorName - Donor's name
 * @param amount - Donation amount
 * @param wishlistTitle - Title of the wishlist
 */
export const sendNGODonationNotificationEmail = async (
  email: string,
  ngoName: string,
  donorName: string,
  amount: number,
  wishlistTitle: string
): Promise<EmailResponse> => {
  const subject = `New donation received - ${wishlistTitle}`;
  const text = `Hello ${ngoName},\n\nYou received a new donation of ₹${amount} from ${donorName} for your wishlist "${wishlistTitle}".\n\nThank you for using Gift for Cause!\n\nBest regards,\nThe Gift for Cause Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #16a34a;">New Donation Received!</h1>
      <p>Hello ${ngoName},</p>
      <p>You received a new donation of <strong>₹${amount}</strong> from <strong>${donorName}</strong> for your wishlist "<strong>${wishlistTitle}</strong>".</p>
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2563eb;">Donation Details</h3>
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p><strong>Donor:</strong> ${donorName}</p>
        <p><strong>Wishlist:</strong> ${wishlistTitle}</p>
      </div>
      <p>Thank you for using Gift for Cause!</p>
      <p>Best regards,<br>The Gift for Cause Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};

/**
 * Send contact form email to admin
 * @param name - Contact person's name
 * @param email - Contact person's email
 * @param subject - Email subject
 * @param message - Contact message
 */
export const sendContactFormEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<EmailResponse> => {
  const emailSubject = `Contact Form: ${subject}`;
  const text = `New contact form submission from ${name} (${email})\n\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nThis message was sent via the Gift for Cause contact form.`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">New Contact Form Submission</h1>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">Contact Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
      </div>
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2563eb;">Message</h3>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
      <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
        This message was sent via the Gift for Cause contact form.
      </p>
    </div>
  `;

  return sendEmail({ 
    to: 'giftforacause@myyahoo.com', 
    subject: emailSubject, 
    text, 
    html 
  });
};