import { Heart, Brain, Activity, Coffee, Phone } from 'lucide-react';

const Wellbeing = () => {
  const resources = [
    {
      icon: Brain,
      title: 'Mental Health Support',
      description: 'Free confidential counseling sessions',
      action: 'Book Session',
      color: 'bg-purple-500',
    },
    {
      icon: Activity,
      title: 'Fitness Programs',
      description: 'Gym membership & fitness classes',
      action: 'View Options',
      color: 'bg-green-500',
    },
    {
      icon: Coffee,
      title: 'Work-Life Balance',
      description: 'Flexible hours & remote work',
      action: 'Learn More',
      color: 'bg-blue-500',
    },
    {
      icon: Phone,
      title: '24/7 Helpline',
      description: 'Emergency support available anytime',
      action: 'Get Number',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Wellbeing</h1>
        <p className="text-gray-600 mt-1">Your health and wellness matter to us</p>
      </div>

      <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-8 text-white">
        <Heart className="w-12 h-12 mb-4" />
        <h2 className="text-2xl font-bold mb-2">How are you feeling today?</h2>
        <p className="mb-4 opacity-90">Your wellbeing is our priority. Access support when you need it.</p>
        <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Talk to Someone
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className={`${resource.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <resource.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
            <button className="text-sm text-primary hover:text-primary-dark font-medium">
              {resource.action} →
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Wellness Events</h3>
        <div className="space-y-3">
          {[
            { title: 'Yoga Class', date: 'Every Monday, 6 PM', location: 'Berlin Office' },
            { title: 'Mental Health Workshop', date: 'Nov 5, 2024', location: 'Virtual' },
            { title: 'Team Building Hike', date: 'Nov 12, 2024', location: 'Grunewald Forest' },
          ].map((event, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{event.title}</p>
                <p className="text-sm text-gray-600">{event.date} • {event.location}</p>
              </div>
              <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors">
                Register
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wellbeing;