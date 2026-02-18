import { useState } from 'react';
import { ArrowRight, Users, Package, Shield, CheckCircle2, Truck, Clock, MapPin, X } from 'lucide-react';

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [requestType, setRequestType] = useState<'demo' | 'trial'>('demo');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phoneNumber: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleOpenModal = (type: 'demo' | 'trial') => {
    setRequestType(type);
    setShowModal(true);
    setSubmitSuccess(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      phoneNumber: '',
      message: ''
    });
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          requestType,
          source: 'landing_page',
          createdAt: new Date().toISOString(),
          status: 'new'
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          handleCloseModal();
          if (requestType === 'demo') {
            window.location.href = '/demo';
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const features = [
    {
      icon: Truck,
      title: 'Logistics-Specific Workflows',
      description: 'Pre-built templates for warehouse, forklift operators, and logistics teams',
    },
    {
      icon: Shield,
      title: 'Safety & Compliance',
      description: 'DGUV, Hazmat, and forklift certifications tracked automatically',
    },
    {
      icon: Clock,
      title: 'Rapid Scaling',
      description: 'Onboard dozens of warehouse staff per week with zero paperwork bottlenecks',
    },
    {
      icon: MapPin,
      title: 'Multi-Location Management',
      description: 'Manage fulfillment centers, warehouses, and hubs from one platform',
    },
  ];

  const benefits = [
    'Dramatically reduce time-to-floor',
    'Automated safety certification tracking',
    'Bilingual onboarding (German, English, Turkish, Polish)',
    'Location-based workflows per hub',
    'Shift-ready workforce metrics',
    'High-turnover environment optimized',
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Lead Capture Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-800">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {requestType === 'demo' ? 'Request a Demo' : 'Start Free Trial'}
                </h2>
                <p className="text-slate-300 mt-1">
                  {requestType === 'demo' 
                    ? 'See HeySalad Harmony in action with a personalized demo' 
                    : 'Get started with HeySalad Harmony today'}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-8 py-6">
              {submitSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                  <p className="text-slate-300">
                    {requestType === 'demo' 
                      ? "We'll be in touch shortly to schedule your demo. Redirecting you to our demo video..."
                      : "Check your email for next steps to get started."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-200 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-slate-900 text-white"
                        placeholder="Max"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-200 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-slate-900 text-white"
                        placeholder="Müller"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-slate-900 text-white"
                      placeholder="max@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-slate-900 text-white"
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-slate-900 text-white"
                      placeholder="+49 30 12345678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Tell us about your needs (optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none bg-slate-900 text-white"
                      placeholder="Number of locations, warehouse staff count, specific challenges..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'Submitting...' : requestType === 'demo' ? 'Request Demo' : 'Start Free Trial'}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-4 border-2 border-slate-700 text-slate-200 font-semibold rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    By submitting this form, you agree to our Privacy Policy and Terms of Service.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-black backdrop-blur border-b border-slate-800 sticky top-0 z-50 shadow-sm shadow-black/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/heysalad-white-logo.svg" 
                alt="HeySalad Harmony" 
                className="h-14"
              />
            </div>

            <button
              onClick={() => handleOpenModal('trial')}
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-black py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-3 relative animate-fade-in">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/hero-image.png" 
                  alt="HR professional managing warehouse workforce with confidence"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8 animate-slide-up">
              <div>
                <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
                  Workers ready faster.
                </h1>
                <p className="text-lg text-slate-300">
                  Human Capital Management orchestration for logistics operations
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <button 
                  onClick={() => handleOpenModal('trial')}
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleOpenModal('demo')}
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200"
                >
                  See Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Warehouse
              <span className="text-primary"> Workforce </span>
              Management Built for Speed
            </h2>

            <p className="text-xl text-slate-300 leading-relaxed">
              Purpose-built HCM platform for logistics operations. Onboard warehouse staff, 
              forklift operators, and shift supervisors faster with AI-powered compliance 
              and multi-location management across Berlin and Hamburg.
            </p>
          </div>

          <div className="relative animate-slide-up">
            <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-6 relative z-10">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">New Hire Package</h3>
                  <p className="text-sm text-slate-300">Max Müller • Warehouse Worker</p>
                  <p className="text-xs text-slate-400">Berlin-Mitte Hub</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">Floor Readiness</span>
                  <span className="text-sm font-bold text-primary">85%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { text: 'Safety Training (DGUV)', icon: CheckCircle2 },
                  { text: 'Forklift Certification', icon: CheckCircle2 },
                  { text: 'Arbeitsvertrag Signed', icon: Clock }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-900/70">
                    <item.icon className={`w-5 h-5 ${item.icon === CheckCircle2 ? 'text-primary' : 'text-slate-500'}`} />
                    <span className="text-sm font-medium text-slate-200">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Built for Logistics Operations
            </h2>
            <p className="text-xl text-slate-300">
              Everything you need to manage warehouse, fulfillment, and logistics teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-900 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-slate-800"
              >
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Perfect for Logistics Operations
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Fulfillment Centers</h3>
              <p className="text-slate-300">
                Rapid onboarding for warehouse workers, pickers, and packers across multiple locations
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Distribution Hubs</h3>
              <p className="text-slate-300">
                Manage forklift operators, shift supervisors, and logistics coordinators efficiently
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">3PL Operations</h3>
              <p className="text-slate-300">
                Scale your workforce up or down based on client needs with zero paperwork lag
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Logistics Teams Choose HeySalad Harmony
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Purpose-built for high-turnover warehouse environments where speed, 
              compliance, and multi-location visibility are critical.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-slate-200 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-primary rounded-2xl text-white text-center shadow-2xl p-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Scale Your Warehouse Workforce?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Get workers floor-ready faster with zero compliance headaches
              </p>
              <button
                onClick={() => handleOpenModal('trial')}
                className="bg-white text-primary hover:bg-gray-100 font-bold px-8 py-4 rounded-xl text-lg flex items-center gap-2 mx-auto transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm opacity-75 mt-4">
                No credit card required • Purpose-built for logistics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="/heysalad-white-logo.svg" 
                alt="HeySalad Harmony" 
                className="h-8"
              />
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-slate-400">
                © 2025 HeySalad Harmony. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
