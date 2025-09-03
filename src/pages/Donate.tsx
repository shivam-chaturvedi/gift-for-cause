import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Check, CreditCard, Shield, Heart, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

type DonationStep = "confirmation" | "details" | "payment" | "success"

const Donate = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const itemId = searchParams.get("item")
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [currentStep, setCurrentStep] = useState<DonationStep>("confirmation")
  const [donationData, setDonationData] = useState({
    amount: 500,
    donorName: "",
    donorEmail: "",
    message: "",
    isAnonymous: false,
  })

  useEffect(() => {
    if (user) {
      setDonationData(prev => ({
        ...prev,
        donorName: user.name,
        donorEmail: user.email,
      }))
    }
  }, [user])

  // Mock item data - in real app this would come from API
  const item = {
    id: itemId || "1",
    name: "School Notebooks & Stationery",
    description: "Essential writing materials for 10 children",
    price: 500,
    image: "/api/placeholder/300/200",
    ngo: "Education First Foundation",
    category: "Education",
    urgency: "high"
  }

  const stepProgress = {
    confirmation: 25,
    details: 50,
    payment: 75,
    success: 100
  }

  const handleNextStep = () => {
    const steps: DonationStep[] = ["confirmation", "details", "payment", "success"]
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handlePrevStep = () => {
    const steps: DonationStep[] = ["confirmation", "details", "payment", "success"]
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "confirmation":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Confirm Your Gift</h2>
              <p className="text-muted-foreground">Review the item you're about to purchase</p>
            </div>

            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <Badge variant={item.urgency === "high" ? "destructive" : "secondary"}>
                        {item.urgency === "high" ? "Urgent" : "Standard"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        For: <span className="font-medium">{item.ngo}</span>
                      </p>
                      <p className="text-xl font-bold text-primary">₹{item.price}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" asChild>
                <Link to="/browse">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Browse
                </Link>
              </Button>
              <Button variant="hero" onClick={handleNextStep}>
                Continue to Details
              </Button>
            </div>
          </motion.div>
        )

      case "details":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Your Details</h2>
              <p className="text-muted-foreground">Help us personalize your donation experience</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donorName">Full Name</Label>
                <Input
                  id="donorName"
                  placeholder="Enter your full name"
                  value={donationData.donorName}
                  onChange={(e) => setDonationData(prev => ({ ...prev, donorName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donorEmail">Email Address</Label>
                <Input
                  id="donorEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={donationData.donorEmail}
                  onChange={(e) => setDonationData(prev => ({ ...prev, donorEmail: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Input
                  id="message"
                  placeholder="Add a message for the NGO"
                  value={donationData.message}
                  onChange={(e) => setDonationData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                variant="hero" 
                onClick={handleNextStep}
                disabled={!donationData.donorName || !donationData.donorEmail}
              >
                Continue to Payment
              </Button>
            </div>
          </motion.div>
        )

      case "payment":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Secure Payment</h2>
              <p className="text-muted-foreground">Complete your donation securely</p>
            </div>

            <Card className="border border-border/50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Payment Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-semibold">₹{item.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-semibold">₹0</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{item.price}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Choose Payment Method</h3>
              <div className="grid gap-3">
                {["Credit/Debit Card", "UPI", "Net Banking", "Wallet"].map((method) => (
                  <motion.button
                    key={method}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 border border-border rounded-lg hover:border-primary transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{method}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button variant="hero" onClick={handleNextStep} className="group">
                <Shield className="w-4 h-4 mr-2" />
                Complete Donation
              </Button>
            </div>
          </motion.div>
        )

      case "success":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Thank You! 🎉</h2>
              <p className="text-lg text-muted-foreground">
                Your donation has been successfully processed
              </p>
            </div>

            <Card className="text-left">
              <CardContent className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Item</span>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">₹{item.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NGO</span>
                  <span className="font-medium">{item.ngo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Donor</span>
                  <span className="font-medium">{donationData.donorName}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <p className="text-muted-foreground">
                A receipt has been sent to <strong>{donationData.donorEmail}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                The NGO will receive your item within 3-5 business days. 
                You'll get updates on the impact your gift creates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link to="/browse">
                  <Gift className="w-4 h-4 mr-2" />
                  Donate Again
                </Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/">
                  <Heart className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent-light/20 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Step {Object.keys(stepProgress).indexOf(currentStep) + 1} of 4
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {Math.round(stepProgress[currentStep])}% Complete
              </span>
            </div>
            <Progress value={stepProgress[currentStep]} className="h-2" />
          </div>

          {/* Main Content */}
          <Card className="shadow-strong border-border/50 backdrop-blur-sm">
            <CardContent className="p-8">
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}

export default Donate