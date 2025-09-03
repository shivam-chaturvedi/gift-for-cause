import { loadStripe } from '@stripe/stripe-js'

// Payment gateway configurations
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_key'
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'your_paypal_client_id'
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_razorpay_key_id'

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret?: string
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  gateway: 'stripe' | 'paypal' | 'razorpay'
}

// Stripe Payment
export const stripePayment = {
  createPaymentIntent: async (amount: number, currency: string = 'usd'): Promise<PaymentIntent> => {
    try {
      const response = await fetch('/api/payments/stripe/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Stripe payment intent error:', error)
      throw error
    }
  },

  confirmPayment: async (paymentIntentId: string, paymentMethodId: string): Promise<PaymentResult> => {
    try {
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe not loaded')

      const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentId, {
        payment_method: paymentMethodId,
      })

      if (error) {
        return {
          success: false,
          error: error.message,
          gateway: 'stripe'
        }
      }

      return {
        success: true,
        transactionId: paymentIntent?.id,
        gateway: 'stripe'
      }
    } catch (error) {
      console.error('Stripe payment confirmation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
        gateway: 'stripe'
      }
    }
  }
}

// PayPal Payment
export const paypalPayment = {
  createOrder: async (amount: number, currency: string = 'USD'): Promise<PaymentIntent> => {
    try {
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create PayPal order')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('PayPal order creation error:', error)
      throw error
    }
  },

  captureOrder: async (orderId: string): Promise<PaymentResult> => {
    try {
      const response = await fetch('/api/payments/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to capture PayPal order')
      }

      const data = await response.json()
      
      return {
        success: true,
        transactionId: data.id,
        gateway: 'paypal'
      }
    } catch (error) {
      console.error('PayPal order capture error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
        gateway: 'paypal'
      }
    }
  }
}

// Razorpay Payment
export const razorpayPayment = {
  createOrder: async (amount: number, currency: string = 'INR'): Promise<PaymentIntent> => {
    try {
      const response = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Razorpay expects amount in paise
          currency,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create Razorpay order')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Razorpay order creation error:', error)
      throw error
    }
  },

  verifyPayment: async (paymentId: string, orderId: string, signature: string): Promise<PaymentResult> => {
    try {
      const response = await fetch('/api/payments/razorpay/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          orderId,
          signature,
        }),
      })

      if (!response.ok) {
        throw new Error('Payment verification failed')
      }

      const data = await response.json()
      
      return {
        success: true,
        transactionId: paymentId,
        gateway: 'razorpay'
      }
    } catch (error) {
      console.error('Razorpay payment verification error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment verification failed',
        gateway: 'razorpay'
      }
    }
  }
}

// Unified Payment Service
export class PaymentService {
  static async processPayment(
    amount: number,
    gateway: 'stripe' | 'paypal' | 'razorpay',
    paymentData: any
  ): Promise<PaymentResult> {
    try {
      switch (gateway) {
        case 'stripe':
          return await stripePayment.confirmPayment(
            paymentData.paymentIntentId,
            paymentData.paymentMethodId
          )
        
        case 'paypal':
          return await paypalPayment.captureOrder(paymentData.orderId)
        
        case 'razorpay':
          return await razorpayPayment.verifyPayment(
            paymentData.paymentId,
            paymentData.orderId,
            paymentData.signature
          )
        
        default:
          throw new Error(`Unsupported payment gateway: ${gateway}`)
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed',
        gateway
      }
    }
  }

  static async createPaymentIntent(
    amount: number,
    gateway: 'stripe' | 'paypal' | 'razorpay',
    currency: string = 'USD'
  ): Promise<PaymentIntent> {
    try {
      switch (gateway) {
        case 'stripe':
          return await stripePayment.createPaymentIntent(amount, currency)
        
        case 'paypal':
          return await paypalPayment.createOrder(amount, currency)
        
        case 'razorpay':
          return await razorpayPayment.createOrder(amount, currency)
        
        default:
          throw new Error(`Unsupported payment gateway: ${gateway}`)
      }
    } catch (error) {
      console.error('Payment intent creation error:', error)
      throw error
    }
  }

  static getGatewayConfig(gateway: 'stripe' | 'paypal' | 'razorpay') {
    switch (gateway) {
      case 'stripe':
        return {
          publishableKey: STRIPE_PUBLISHABLE_KEY,
          currency: 'USD'
        }
      
      case 'paypal':
        return {
          clientId: PAYPAL_CLIENT_ID,
          currency: 'USD'
        }
      
      case 'razorpay':
        return {
          keyId: RAZORPAY_KEY_ID,
          currency: 'INR'
        }
      
      default:
        throw new Error(`Unsupported payment gateway: ${gateway}`)
    }
  }
}

// Mock payment processing for development
export const mockPayment = {
  process: async (amount: number, gateway: 'stripe' | 'paypal' | 'razorpay'): Promise<PaymentResult> => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate 90% success rate
    const success = Math.random() > 0.1
    
    if (success) {
      return {
        success: true,
        transactionId: `mock_${gateway}_${Date.now()}`,
        gateway
      }
    } else {
      return {
        success: false,
        error: 'Payment was declined by the bank',
        gateway
      }
    }
  },

  createIntent: async (amount: number, gateway: 'stripe' | 'paypal' | 'razorpay'): Promise<PaymentIntent> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      id: `mock_${gateway}_intent_${Date.now()}`,
      amount,
      currency: gateway === 'razorpay' ? 'INR' : 'USD',
      status: 'requires_payment_method',
      client_secret: `mock_secret_${Date.now()}`
    }
  }
}
