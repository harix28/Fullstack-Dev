import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Send, Shield, CheckCircle2, HelpCircle, MessageSquare } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button, Card, Badge } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
export default function ContactPage() {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        category: 'General Inquiry',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const emergencyHelplines = [
        { number: '112', title: 'National Emergency', desc: 'All-in-one Police, Fire & Medical response', badge: '24x7' },
        { number: '1091', title: 'Women Helpline', desc: 'Safety, harassment & emergency assistance for women', badge: 'Toll-free' },
        { number: '1075', title: 'National Health Helpline', desc: 'Health advisories, tele-consultation & wellness support', badge: 'Govt. of India' },
        { number: '1912', title: 'Electricity Complaints', desc: 'Power outages, line faults & billing assistance', badge: 'State DISCOMs' },
        { number: '1930', title: 'National Cyber Crime', desc: 'Financial fraud & cyber crime reporting hotline', badge: 'MHA Helpline' },
        { number: '1800-11-4000', title: 'National Consumer Helpline', desc: 'Consumer rights, disputes & product grievances', badge: 'Toll-free' },
    ];
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            showToast({
                title: 'Feedback Received',
                description: 'Thank you for reaching out. Our support team will review your query within 24 business hours.',
                variant: 'success',
            });
            setFormData({
                name: '',
                email: '',
                phone: '',
                category: 'General Inquiry',
                subject: '',
                message: '',
            });
        }, 1000);
    };
    return (<div className="min-h-screen flex flex-col font-sans bg-[#F5EBE0] transition-colors">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Header */}
        <section className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-12">
          <Badge className="bg-[#59463B]/10 text-[#59463B] border-[#59463B]/20 mb-3">
            Citizen Support & Helpline Center
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D231E] mb-4">
            We Are Here to Help
          </h1>
          <p className="text-lg text-[#6B5E55] max-w-2xl mx-auto">
            Have questions about GovConnect, need assistance with citizen schemes, or want to report an issue? Reach out to us or consult national emergency helplines.
          </p>
        </section>

        {/* Emergency Helplines Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#2D231E] flex items-center gap-2">
                <Phone className="w-6 h-6 text-red-500"/>
                National Citizen Emergency Helplines
              </h2>
              <p className="text-sm text-[#7D6E63]">
                Official Indian government hotlines available toll-free across all states and union territories.
              </p>
            </div>
            <span className="hidden sm:inline-flex px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200">
              Immediate Assistance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyHelplines.map((item, idx) => (<Card key={idx} className="p-5 border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-2xl font-extrabold text-red-600 tracking-tight font-mono">
                    {item.number}
                  </span>
                  <Badge variant="outline" className="text-[11px] font-medium">
                    {item.badge}
                  </Badge>
                </div>
                <h3 className="font-bold text-[#2D231E] text-base mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#7D6E63]">
                  {item.desc}
                </p>
              </Card>))}
          </div>
        </section>

        {/* Contact Form & Information Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contact Information & Hours */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="p-6 bg-[#2D231E] text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#A67C65]"/>
                  GovConnect Project Desk
                </h3>
                <p className="text-[#E3D5CA] text-sm mb-6 leading-relaxed">
                  GovConnect is developed as a major college engineering capstone project. Our mission is to eliminate bureaucratic friction and empower every Indian citizen.
                </p>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#A67C65] shrink-0 mt-0.5"/>
                    <div>
                      <p className="font-semibold text-white">Innovation Center</p>
                      <p className="text-[#D6CCC2]">National Capital Region, New Delhi, India 110001</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#A67C65] shrink-0 mt-0.5"/>
                    <div>
                      <p className="font-semibold text-white">Direct Support Email</p>
                      <p className="text-[#D6CCC2] font-mono">support@govconnect.gov.in (Prototype Desk)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#A67C65] shrink-0 mt-0.5"/>
                    <div>
                      <p className="font-semibold text-white">Operating Hours</p>
                      <p className="text-[#D6CCC2]">Monday – Saturday: 09:00 AM – 06:00 PM IST</p>
                      <p className="text-[#D5BDAF] text-xs mt-0.5">AI Assistance is active 24x7</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-[#D6CCC2]">Have a quick question?</span>
                  <Link to="/ask-sarkar" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#A67C65] text-[#2D231E] rounded-md text-xs font-bold hover:bg-[#D5BDAF] transition-colors">
                    <MessageSquare className="w-3.5 h-3.5"/>
                    Ask Sarkar AI
                  </Link>
                </div>
              </Card>

              {/* FAQ preview card */}
              <Card className="p-6">
                <h4 className="font-bold text-[#2D231E] mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#59463B]"/>
                  Frequently Asked Questions
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-[#2D231E]">Does GovConnect charge any fees?</p>
                    <p className="text-[#6B5E55] text-xs">No. GovConnect is 100% free and open for every citizen of India.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#2D231E]">Is my personal data safe?</p>
                    <p className="text-[#6B5E55] text-xs">All demo documents and credentials remain strictly local to your browser session.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#2D231E]">Where do I submit my final applications?</p>
                    <p className="text-[#6B5E55] text-xs">GovConnect prepares your eligibility and drafts. Submissions occur directly on official government portals (CPGRAMS, MyScheme, etc.).</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <Card className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-[#2D231E] mb-2">
                  Send Us a Message
                </h3>
                <p className="text-[#6B5E55] text-sm mb-6">
                  Fill out the form below with your feedback, suggestions, or technical assistance request.
                </p>

                {submitted ? (<div className="p-8 text-center bg-green-50 rounded-xl border border-green-200 space-y-4">
                    <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto"/>
                    <h4 className="text-xl font-bold text-green-800">Message Submitted Successfully!</h4>
                    <p className="text-sm text-green-700 max-w-md mx-auto">
                      Thank you for contacting GovConnect. We have recorded your query and will get back to you shortly.
                    </p>
                    <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-4">
                      Send Another Message
                    </Button>
                  </div>) : (<form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#2D231E] mb-1">
                          Full Name *
                        </label>
                        <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Hari Sharma" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] bg-white text-[#2D231E] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2D231E] mb-1">
                          Email Address *
                        </label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="e.g. hari.sharma@example.com" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] bg-white text-[#2D231E] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]"/>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#2D231E] mb-1">
                          Phone Number (Optional)
                        </label>
                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="10-digit mobile number" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] bg-white text-[#2D231E] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2D231E] mb-1">
                          Inquiry Category
                        </label>
                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] bg-white text-[#2D231E] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]">
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Scheme Recommendation Feedback">Scheme Recommendation Feedback</option>
                          <option value="Grievance Workflow Help">Grievance Workflow Help</option>
                          <option value="Document Vault Support">Document Vault Support</option>
                          <option value="Bug Report / UI Feedback">Bug Report / UI Feedback</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2D231E] mb-1">
                        Subject *
                      </label>
                      <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="Brief summary of your message" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] bg-white text-[#2D231E] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2D231E] mb-1">
                        Message Details *
                      </label>
                      <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Describe your question or feedback in detail..." className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] bg-white text-[#2D231E] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]"/>
                    </div>

                    <div className="pt-2">
                      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-[#59463B] hover:bg-[#2D231E] text-white px-8 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2">
                        <Send className="w-4 h-4"/>
                        {isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}
                      </Button>
                    </div>
                  </form>)}
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>);
}
