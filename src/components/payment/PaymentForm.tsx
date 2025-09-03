import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { CreditCard, Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { PaymentService, mockPayment } from '@/lib/payment'
import { donationAPI } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'

interface PaymentFormProps {
  wishlistItemId: string
  ngoId: string
  itemName: string
  amount: number
  onSuccess?: (transactionId: string) => void
  onError?: (error: string) => void
}

interface PaymentMethod {
  id: 'stripe' | 'paypal' | 'razorpay'
  name: string
  description: string
  icon: string
  currency: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'stripe',
    name: 'Credit/Debit Card',
    description: 'Secure payment via Stripe',
    icon: '💳',
    currency: 'USD'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: '🔵',
    currency: 'USD'
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Popular Indian payment gateway',
    icon: '🇮🇳',
    currency: 'INR'
  }
]

export function PaymentForm({ 
  wishlistItemId, 
  ngoId, 
  itemName, 
  amount, 
  onSuccess, 
  onError 
}: PaymentFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentMethods[0])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [donorName, setDonorName] = useState(user?.name || '')
  const [donorEmail, setDonorEmail] = useState(user?.email || '')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')

  useEffect(() => {
    if (user) {
      setDonorName(user.name)
      setDonorEmail(user.email)
    }
  }, [user])

  const handlePayment = async () => {
    if (!donorName || !donorEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)

    try {
      // For demo purposes, use mock payment
      const result = await mockPayment.process(amount, selectedMethod.id)
      
      if (result.success && result.transactionId) {
        // Create donation record
        await donationAPI.create({
          donor_id: user?.id || '',
          ngo_id: ngoId,
          wishlist_item_id: wishlistItemId,
          amount: amount,
          gateway: selectedMethod.id,
          txn_id: result.transactionId,
          status: 'completed',
          anonymous: isAnonymous
        })

        toast({
          title: "Payment Successful!",
          description: "Your donation has been processed successfully",
        })

        onSuccess?.(result.transactionId)
      } else {
        throw new Error(result.error || 'Payment failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive"
      })

      onError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Complete Your Donation
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Secure payment to make a difference
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Donation Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Donation Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Item:</span>
                <span className="font-medium">{itemName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="font-bold text-lg text-green-600">
                  ${amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Donor Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Your Information
            </h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              />
              <Label htmlFor="anonymous" className="text-sm">
                Make this donation anonymous
              </Label>
            </div>

            {!isAnonymous && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Payment Method
            </h3>
            
            <RadioGroup
              value={selectedMethod.id}
              onValueChange={(value) => {
                const method = paymentMethods.find(m => m.id === value)
                if (method) setSelectedMethod(method)
              }}
              className="space-y-3"
            >
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label
                    htmlFor={method.id}
                    className="flex items-center space-x-3 cursor-pointer flex-1"
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-500">{method.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Payment Details */}
          {selectedMethod.id === 'stripe' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Card Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardholder">Cardholder Name</Label>
                  <Input
                    id="cardholder"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="Name on card"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardnumber">Card Number</Label>
                  <Input
                    id="cardnumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Secure Payment
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-12 text-lg font-semibold"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing Payment...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Pay ${amount.toLocaleString()}</span>
              </div>
            )}
          </Button>

          {/* Payment Methods Logos */}
          <div className="flex justify-center items-center space-x-4 pt-4 border-t">
            <div className="flex items-center space-x-2 text-gray-500">
              <CreditCard className="h-4 w-4" />
              <span className="text-xs">Stripe</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <span className="text-xs">PayPal</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <span className="text-xs">Razorpay</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
