import { ArrowLeft, Play, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DemoPage = () => {
  const navigate = useNavigate();

  const keyFeatures = [
    'Rapid warehouse workforce onboarding',
    'Automated compliance tracking',
    'Multi-location management',
    'Real-time floor readiness metrics',
    'Bilingual support (DE, EN, TR, PL)',
    'Safety certification automation'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/bereit-logo.png" 
                alt="bereit" 
                className="h-14"
              />
            </div>

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Play className="w-4 h-4" />
              Product Demo
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-secondary mb-6">
              See Bereit in Action
            </h1>
            <p className="text-xl text-gray-600">
              Watch how leading logistics companies onboard warehouse staff 3x faster 
              with zero compliance headaches
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 pb-20">
        <div className="space-y-12">
          {/* First Video */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="aspect-video bg-black">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/ag6fbypcpXs?si=IaZo_0uLsiwW9alN" 
                title="Bereit Product Demo" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>

          {/* Second Video */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="aspect-video bg-black">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/0JMmnd7CNI8?si=1av8YA7Qk-LhiFJe" 
                title="Bereit Product Demo 2" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Highlight */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary mb-4">
              What You'll See in the Demo
            </h2>
            <p className="text-xl text-gray-600">
              Key features that make warehouse workforce management effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
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
                Ready to Transform Your Workforce Management?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Join leading logistics companies already using Bereit
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-primary hover:bg-gray-100 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200"
                >
                  Learn More
                </button>
              </div>
              <p className="text-sm opacity-75 mt-6">
                No credit card required • Setup in minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="/bereit-logo.png" 
                alt="bereit" 
                className="h-8"
              />
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600">
                © 2025 Bereit. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DemoPage;