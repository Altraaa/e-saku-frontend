import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  FileText, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  ChevronDown,
  Search,
  Info,
  AlertTriangle,
  Award,
  Calendar,
  Database,
  Settings,
  UserCheck,
  Download,
  RefreshCw,
  CheckCircle,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PolicySectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  category?: string;
}

const PolicySection: React.FC<PolicySectionProps> = ({ 
  id, 
  title, 
  icon, 
  children, 
  category 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
      {category && (
        <div className="bg-green-50 px-4 py-1 text-xs font-medium text-green-600">
          {category}
        </div>
      )}
      <button
        className={`w-full flex items-center p-4 cursor-pointer transition-colors duration-300 ${
          isOpen ? "bg-green-50" : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`policy-content-${id}`}
      >
        <div className="flex items-center justify-center p-2 mr-4 rounded-full bg-green-100 text-green-600">
          {icon}
        </div>
        <h3 className="flex-1 font-medium text-gray-800 text-left">{title}</h3>
        <ChevronDown 
          className={`text-gray-500 transition-transform duration-300 ease-in-out ${
            isOpen ? "transform rotate-180" : ""
          }`} 
          size={20}
        />
      </button>
      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: `${contentHeight}px` }}
        id={`policy-content-${id}`}
        role="region"
      >
        <div 
          ref={contentRef}
          className="p-6 pt-4 pl-16 text-gray-600 bg-white"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const PrivacyPolicySkeleton = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6 animate-pulse">
      <div className="bg-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-gray-300 p-3 rounded-lg mr-4 w-14 h-14"></div>
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-300 rounded"></div>
            <div className="h-4 w-96 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-300 rounded-lg h-20"></div>
          ))}
        </div>
      </div>

      <div className="h-10 w-64 bg-gray-200 rounded-lg"></div>

      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg">
            <div className="flex items-center p-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div className="h-6 w-48 bg-gray-300 rounded flex-1"></div>
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactCard = ({ title, description, icon, actionText, actionUrl }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionText: string;
  actionUrl: string;
}) => {
  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-full bg-green-100 text-green-600 mr-4">
            {icon}
          </div>
          <h3 className="font-medium text-lg text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <a 
          href={actionUrl}
          className="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition-colors"
        >
          {actionText} <ExternalLink size={16} className="ml-1" />
        </a>
      </CardContent>
    </Card>
  );
};

const ViewPrivacyPolicy: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const policyData = [
    {
      id: "overview",
      title: "Overview & Scope",
      icon: <FileText size={20} />,
      category: "General",
      content: (
        <div className="space-y-4">
          <p>
            This Privacy Policy describes how E-Saku collects, uses, and protects your personal 
            information when you interact with our educational platform and services.
          </p>
          
          <Alert className="bg-green-50 border border-green-200 text-green-800">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Key Principles:</strong> We prioritize transparency, minimal data collection, 
              user control, and strong security measures to protect your information.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">This policy applies to:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>All users of E-Saku services</li>
              <li>All forms of data collection through our platform</li>
              <li>Educational institutions and their stakeholders</li>
              <li>Students, teachers, parents, and administrators</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "collection",
      title: "Information We Collect",
      icon: <Database size={20} />,
      category: "Data Collection",
      content: (
        <div className="space-y-4">
          <p>We collect information to provide and improve our educational services:</p>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-500 hover:bg-green-500">
                  <TableHead className="text-white font-medium">Category</TableHead>
                  <TableHead className="text-white font-medium">Information Type</TableHead>
                  <TableHead className="text-white font-medium">Collection Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium">Personal Data</TableCell>
                  <TableCell>Name, email, phone number</TableCell>
                  <TableCell>Direct user input</TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium">Account Info</TableCell>
                  <TableCell>Username, preferences, settings</TableCell>
                  <TableCell>Registration process</TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium">Usage Data</TableCell>
                  <TableCell>Page views, interactions, time spent</TableCell>
                  <TableCell>Automatic tracking</TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium">Device Info</TableCell>
                  <TableCell>IP address, browser type, OS</TableCell>
                  <TableCell>Automatic collection</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-600" />
                  Automatic Collection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• IP address and general location</li>
                  <li>• Device and browser information</li>
                  <li>• Usage patterns and analytics</li>
                  <li>• Performance and error logs</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Voluntary Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Account registration details</li>
                  <li>• Profile information and photos</li>
                  <li>• Messages and communications</li>
                  <li>• Survey responses and feedback</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      icon: <Settings size={20} />,
      category: "Data Processing",
      content: (
        <div className="space-y-4">
          <p>We process your personal information for legitimate educational purposes:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <FileText className="h-5 w-5" />, title: "Service Provision", desc: "Deliver core platform functionality" },
              { icon: <Users className="h-5 w-5" />, title: "User Support", desc: "Provide customer assistance" },
              { icon: <Shield className="h-5 w-5" />, title: "Security", desc: "Protect against fraud and abuse" },
              { icon: <Award className="h-5 w-5" />, title: "Improvements", desc: "Enhance user experience" },
              { icon: <Mail className="h-5 w-5" />, title: "Communications", desc: "Send important updates" },
              { icon: <Lock className="h-5 w-5" />, title: "Compliance", desc: "Meet legal requirements" }
            ].map((item, index) => (
              <Card key={index} className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert className="bg-blue-50 border border-blue-200 text-blue-800">
            <Award className="h-4 w-4" />
            <AlertDescription>
              <strong>Educational Focus:</strong> All data processing is primarily focused on 
              enhancing educational outcomes and maintaining a safe learning environment.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      id: "sharing",
      title: "Information Sharing & Disclosure",
      icon: <Users size={20} />,
      category: "Data Sharing",
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="font-medium text-red-800 mb-2">
              🚫 We do not sell your personal information to third parties.
            </p>
            <p className="text-sm text-red-700">
              Your data is only shared in limited circumstances outlined below.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Service Providers",
                description: "Trusted third parties who help operate our services under strict confidentiality agreements",
                icon: <Settings className="h-4 w-4" />
              },
              {
                title: "Legal Requirements",
                description: "When required by law, court order, or government regulation",
                icon: <Shield className="h-4 w-4" />
              },
              {
                title: "Safety & Security",
                description: "To protect the rights, property, or safety of users and the public",
                icon: <Lock className="h-4 w-4" />
              },
              {
                title: "With Your Consent",
                description: "When you explicitly authorize sharing for specific purposes",
                icon: <UserCheck className="h-4 w-4" />
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "security",
      title: "Data Security Measures",
      icon: <Lock size={20} />,
      category: "Security",
      content: (
        <div className="space-y-4">
          <p>
            We implement comprehensive security measures to protect your information:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Settings className="h-5 w-5 text-green-600" />
                Technical Safeguards
              </h4>
              <div className="space-y-2">
                {[
                  "AES-256 encryption for data at rest",
                  "TLS 1.3 encryption for data in transit",
                  "Multi-factor authentication",
                  "Regular security audits"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Administrative Controls
              </h4>
              <div className="space-y-2">
                {[
                  "Staff security training programs",
                  "Background checks for personnel",
                  "Incident response procedures",
                  "Access control policies"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Alert className="bg-yellow-50 border border-yellow-200 text-yellow-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Breach Notification:</strong> We will notify affected users within 72 hours 
              of discovering any security incident that may impact personal data.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      id: "rights",
      title: "Your Privacy Rights",
      icon: <UserCheck size={20} />,
      category: "User Rights",
      content: (
        <div className="space-y-4">
          <p>You have several rights regarding your personal information:</p>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-500 hover:bg-green-500">
                  <TableHead className="text-white font-medium">Right</TableHead>
                  <TableHead className="text-white font-medium">Description</TableHead>
                  <TableHead className="text-white font-medium">How to Exercise</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium">Access</TableCell>
                  <TableCell>Request a copy of your data</TableCell>
                  <TableCell>Account settings or contact us</TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium">Rectification</TableCell>
                  <TableCell>Correct inaccurate information</TableCell>
                  <TableCell>Account settings or contact us</TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium">Erasure</TableCell>
                  <TableCell>Request deletion of your data</TableCell>
                  <TableCell>Account deletion or contact us</TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium">Portability</TableCell>
                  <TableCell>Receive data in structured format</TableCell>
                  <TableCell>Data export tools</TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium">Objection</TableCell>
                  <TableCell>Object to processing for marketing</TableCell>
                  <TableCell>Unsubscribe links</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Request Process
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-green-700">
              <li>Submit request through our contact channels</li>
              <li>Verify your identity for security</li>
              <li>Receive confirmation and timeline</li>
              <li>Get notification when completed (within 30 days)</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: "cookies",
      title: "Cookies & Tracking Technologies",
      icon: <Globe size={20} />,
      category: "Technology",
      content: (
        <div className="space-y-4">
          <p>We use cookies and similar technologies to enhance your experience:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Essential", purpose: "Basic functionality", duration: "Session", required: true },
              { name: "Analytics", purpose: "Usage analytics", duration: "1-2 years", required: false },
              { name: "Functional", purpose: "Enhanced features", duration: "1 year", required: false },
              { name: "Marketing", purpose: "Targeted advertising", duration: "1-2 years", required: false }
            ].map((cookie, index) => (
              <Card key={index} className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{cookie.name} Cookies</h4>
                    <Badge variant={cookie.required ? "default" : "outline"} className={cookie.required ? "bg-green-500" : ""}>
                      {cookie.required ? "Required" : "Optional"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{cookie.purpose}</p>
                  <p className="text-xs text-gray-500">Duration: {cookie.duration}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Cookie Management</h4>
            <p className="text-sm text-blue-700">
              You can control cookie settings through your browser preferences or our cookie 
              preference center. Note that disabling certain cookies may affect functionality.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "children",
      title: "Children's Privacy Protection",
      icon: <Shield size={20} />,
      category: "Special Protections",
      content: (
        <div className="space-y-4">
          <p>We are committed to protecting children's privacy in educational settings:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-blue-200">
              <CardHeader className="pb-3 bg-blue-50">
                <CardTitle className="text-base text-blue-800">Educational Compliance</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• COPPA and FERPA compliant</li>
                  <li>• School-authorized usage only</li>
                  <li>• Special protections for under-13</li>
                  <li>• Educational purpose restrictions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="pb-3 bg-green-50">
                <CardTitle className="text-base text-green-800">Parental Rights</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Review child's information</li>
                  <li>• Request data deletion</li>
                  <li>• Control information collection</li>
                  <li>• Receive practice notifications</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "changes",
      title: "Policy Updates & Changes",
      icon: <RefreshCw size={20} />,
      category: "Policy Management",
      content: (
        <div className="space-y-4">
          <p>We may update this policy to reflect changes in our practices or legal requirements:</p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3">Version History</h4>
            <div className="space-y-3">
              {[
                { version: "2.0", date: "January 21, 2025", changes: "Enhanced security measures, expanded user rights", current: true },
                { version: "1.5", date: "June 15, 2024", changes: "Added cookie management options", current: false },
                { version: "1.0", date: "January 1, 2024", changes: "Initial policy publication", current: false }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Badge variant={item.current ? "default" : "outline"} className={item.current ? "bg-green-500" : ""}>
                      v{item.version}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.date}</p>
                      <p className="text-xs text-gray-600">{item.changes}</p>
                    </div>
                  </div>
                  {item.current && (
                    <Badge className="bg-blue-500 text-white">Current</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Alert className="bg-blue-50 border border-blue-200 text-blue-800">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Notification:</strong> We will notify you of material changes via email or 
              prominent website notice. Continued use constitutes acceptance of updates.
            </AlertDescription>
          </Alert>
        </div>
      )
    }
  ];

  const filteredPolicyData = policyData.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <PrivacyPolicySkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="bg-green-600 p-3 rounded-lg mr-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
            <p className="text-gray-600 max-w-3xl">
              Your privacy is important to us. This policy explains how we collect, use, and protect 
              your information when you use our E-Saku educational platform.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Card className="bg-white border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">January 21, 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Version</p>
                  <p className="font-medium">2.0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Effective Date</p>
                  <p className="font-medium">January 21, 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search privacy policy sections..."
          className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <p className="text-sm text-gray-500">
          {filteredPolicyData.length} section{filteredPolicyData.length !== 1 ? 's' : ''} found for "{searchTerm}"
        </p>
      )}

      {/* Policy Sections */}
      {filteredPolicyData.length > 0 ? (
        <div className="space-y-4">
          {filteredPolicyData.map((section) => (
            <PolicySection
              key={section.id}
              id={section.id}
              title={section.title}
              icon={section.icon}
              category={section.category}
            >
              {section.content}
            </PolicySection>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No results found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We couldn't find any policy sections matching your search. Try different keywords or contact our support team.
          </p>
        </div>
      )}

      {/* Contact Section */}
      <div className="mt-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Contact Our Privacy Team</h2>
          <p className="text-gray-600">
            Have questions about this policy or need to exercise your privacy rights? We're here to help.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ContactCard
            title="Email Support"
            description="Send us your privacy questions and we'll respond within 24 hours."
            icon={<Mail size={20} />}
            actionText="privacy@esaku.edu"
            actionUrl="mailto:privacy@esaku.edu"
          />
          
          <ContactCard
            title="Phone Support"
            description="Call our privacy hotline during business hours for urgent matters."
            icon={<Phone size={20} />}
            actionText="+1 (555) 123-4567"
            actionUrl="tel:+15551234567"
          />
          
          <ContactCard
            title="Mailing Address"
            description="Send written requests to our privacy officer at our headquarters."
            icon={<MapPin size={20} />}
            actionText="View Address"
            actionUrl="#address"
          />
          
          <ContactCard
            title="Data Requests"
            description="Submit formal requests to access, correct, or delete your personal data."
            icon={<FileText size={20} />}
            actionText="Submit Request"
            actionUrl="#data-request"
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Mail className="h-4 w-4 mr-2" />
            Contact Privacy Team
          </Button>
          <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
            <Download className="h-4 w-4 mr-2" />
            Download Policy (PDF)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewPrivacyPolicy;