import { Shield, Heart, Umbrella, TrendingUp } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: Shield,
      title: 'Health Insurance',
      provider: 'TK - Techniker Krankenkasse',
      coverage: 'Full coverage',
      premium: '€420/month',
      color: 'bg-blue-500',
    },
    {
      icon: Heart,
      title: 'Pension Plan',
      provider: 'Company Pension Scheme',
      coverage: '5% employer contribution',
      premium: '€175/month',
      color: 'bg-green-500',
    },
    {
      icon: Umbrella,
      title: 'Accident Insurance',
      provider: 'Allianz',
      coverage: 'Work & leisure',
      premium: '€45/month',
      color: 'bg-yellow-500',
    },
    {
      icon: TrendingUp,
      title: 'Investment Savings',
      provider: 'Company Matching',
      coverage: 'Up to 3% match',
      premium: 'Optional',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Insurance & Pension</h1>
        <p className="text-gray-600 mt-1">Manage your benefits and coverage</p>
      </div>

      <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Total Benefits Value</h3>
        <p className="text-4xl font-bold mb-1">€640/month</p>
        <p className="text-sm opacity-90">Additional to your salary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`${benefit.color} p-3 rounded-lg`}>
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Provider:</span>
                <span className="font-medium text-gray-900">{benefit.provider}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Coverage:</span>
                <span className="font-medium text-gray-900">{benefit.coverage}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Premium:</span>
                <span className="font-medium text-gray-900">{benefit.premium}</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-900 transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Documents</h3>
        <div className="space-y-3">
          {[
            'Health Insurance Card',
            'Pension Plan Agreement',
            'Accident Insurance Policy',
            'Benefits Overview 2024',
          ].map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-900">{doc}</span>
              <button className="text-sm text-primary hover:text-primary-dark font-medium">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Benefits;