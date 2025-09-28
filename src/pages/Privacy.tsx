import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Users, Mail, FileText } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-6 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Privacy Policy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
            Your Privacy Matters
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            We are committed to protecting your personal information and ensuring transparency in how we collect, use, and safeguard your data.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Introduction */}
          <Card>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg self-start">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Introduction</h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Gift for Cause ("we," "our," or "us") operates the giftforacause.net website and platform. 
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                    when you use our platform to connect donors with NGOs and facilitate charitable giving.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg self-start">
                  <Database className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Information We Collect</h2>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-2">Personal Information</h3>
                      <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-muted-foreground pl-2">
                        <li>Name and contact information (email address, phone number)</li>
                        <li>Account credentials and profile information</li>
                        <li>Communication preferences and correspondence</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-2">NGO Information</h3>
                      <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-muted-foreground pl-2">
                        <li>Organization details (name, registration number, mission statement)</li>
                        <li>Verification documents and certificates</li>
                        <li>Bank account details for donation processing</li>
                        <li>Tax exemption certificates (80G/12A)</li>
                        <li>Wishlist and campaign information</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-2">Usage Information</h3>
                      <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-muted-foreground pl-2">
                        <li>Platform usage patterns and preferences</li>
                        <li>Device information and browser data</li>
                        <li>IP address and location data</li>
                        <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg self-start">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">How We Use Your Information</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-2">Service Provision</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground pl-2">
                          <li>Create and manage user accounts</li>
                          <li>Process donations and transactions</li>
                          <li>Facilitate NGO verification</li>
                          <li>Enable wishlist creation and management</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-2">Communication</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground pl-2">
                          <li>Send donation confirmations</li>
                          <li>Provide platform updates</li>
                          <li>Respond to inquiries and support requests</li>
                          <li>Send important service notifications</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-2">Legal Compliance</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground pl-2">
                          <li>Comply with tax regulations</li>
                          <li>Meet anti-money laundering requirements</li>
                          <li>Respond to legal requests</li>
                          <li>Maintain audit trails</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-2">Platform Improvement</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground pl-2">
                          <li>Analyze usage patterns</li>
                          <li>Improve user experience</li>
                          <li>Develop new features</li>
                          <li>Ensure platform security</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-orange-500/10 rounded-lg self-start">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Information Sharing</h2>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                      We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                    </p>

                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-2">Service Providers</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          We may share information with trusted third-party service providers who assist us in operating our platform, 
                          such as payment processors, email services, and cloud hosting providers. These providers are bound by 
                          confidentiality agreements and are prohibited from using your information for any other purpose.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-2">Legal Requirements</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          We may disclose information when required by law, court order, or government regulation, 
                          or when necessary to protect our rights, property, or safety, or that of our users.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-2">NGO Transparency</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          Donation information may be shared with the receiving NGO for transparency and reporting purposes. 
                          This includes donor information (name and donation amount) unless you choose to remain anonymous.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-red-500/10 rounded-lg self-start">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Data Security</h2>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                      We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold mb-2">Technical Safeguards</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground pl-2">
                            <li>SSL encryption for data transmission</li>
                            <li>Encrypted data storage</li>
                            <li>Regular security audits</li>
                            <li>Secure payment processing</li>
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold mb-2">Administrative Safeguards</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground pl-2">
                            <li>Access controls and authentication</li>
                            <li>Staff training on data protection</li>
                            <li>Incident response procedures</li>
                            <li>Regular policy reviews</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg self-start">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Your Rights</h2>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                      Under applicable data protection laws (GDPR, DPDPA, etc.), you have the following rights regarding your personal information:
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold mb-2">Access & Portability</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground pl-2">
                            <li>Request access to your personal data</li>
                            <li>Obtain a copy of your data in a portable format</li>
                            <li>Know how your data is being processed</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-base sm:text-lg font-semibold mb-2">Correction & Updates</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground pl-2">
                            <li>Correct inaccurate personal information</li>
                            <li>Update your profile and preferences</li>
                            <li>Modify your communication settings</li>
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold mb-2">Deletion & Restriction</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground pl-2">
                            <li>Request deletion of your personal data</li>
                            <li>Restrict processing of your information</li>
                            <li>Object to certain types of processing</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-base sm:text-lg font-semibold mb-2">Withdrawal & Complaints</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground pl-2">
                            <li>Withdraw consent at any time</li>
                            <li>Lodge complaints with supervisory authorities</li>
                            <li>Seek legal remedies for data breaches</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg self-start">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Contact Us</h2>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                      If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
                    </p>

                    <div className="bg-muted/50 rounded-lg p-4 sm:p-6">
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            <span className="font-medium text-sm sm:text-base">Email:</span>
                          </div>
                          <span className="text-xs sm:text-sm text-muted-foreground break-all">giftforacause@myyahoo.com</span>
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          We will respond to your inquiry within 48 hours during business days.
                        </div>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                      <p>
                        <strong>Data Protection Officer:</strong> For specific data protection concerns, 
                        please mark your email with "Data Protection Inquiry" in the subject line.
                      </p>
                      <p>
                        <strong>Response Time:</strong> We are committed to responding to all privacy-related 
                        inquiries within 30 days as required by applicable data protection laws.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Updates */}
          <Card>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Policy Updates</h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed px-2">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, 
                  technology, legal requirements, or other factors. We will notify you of any material changes 
                  by posting the updated policy on our website and updating the "Last updated" date.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground px-2">
                  We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
