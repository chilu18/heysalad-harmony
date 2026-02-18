import { AlertTriangle, CheckCircle, Shield, FileText, Calendar } from 'lucide-react';

const SafetyCompliance = () => {
  const safetyStats = [
    { label: 'Safety Score', value: '95%', change: '+3% this month', icon: Shield, color: 'bg-green-500' },
    { label: 'Incidents (30d)', value: '3', change: '-2 from last month', icon: AlertTriangle, color: 'bg-yellow-500' },
    { label: 'Inspections Due', value: '5', change: '2 urgent', icon: FileText, color: 'bg-blue-500' },
    { label: 'Training Complete', value: '89%', change: '11% pending', icon: CheckCircle, color: 'bg-purple-500' },
  ];

  const incidents = [
    { type: 'Minor', description: 'Slip on wet floor - Berlin Hub', date: 'Oct 28, 2024', severity: 'low', status: 'resolved' },
    { type: 'Minor', description: 'Equipment malfunction - Munich', date: 'Oct 25, 2024', severity: 'low', status: 'resolved' },
    { type: 'Major', description: 'Forklift collision - Hamburg Port', date: 'Oct 20, 2024', severity: 'high', status: 'investigating' },
  ];

  const inspections = [
    { location: 'Berlin Hub', type: 'Fire Safety', dueDate: 'Nov 5, 2024', status: 'urgent' },
    { location: 'Munich Center', type: 'Equipment', dueDate: 'Nov 8, 2024', status: 'upcoming' },
    { location: 'Hamburg Port', type: 'General Safety', dueDate: 'Nov 10, 2024', status: 'upcoming' },
    { location: 'Frankfurt', type: 'Fire Safety', dueDate: 'Nov 3, 2024', status: 'urgent' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Safety Compliance</h1>
            <p className="text-gray-600 mt-1">Monitor workplace safety and incidents</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
            <AlertTriangle className="w-4 h-4" />
            Report Incident
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {safetyStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Incidents</h3>
            <div className="space-y-3">
              {incidents.map((incident, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      incident.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {incident.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      incident.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{incident.description}</p>
                  <p className="text-xs text-gray-500">{incident.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Inspections</h3>
            <div className="space-y-3">
              {inspections.map((inspection, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{inspection.location}</p>
                      <p className="text-xs text-gray-600 mt-1">{inspection.type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      inspection.status === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {inspection.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Due: {inspection.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyCompliance;