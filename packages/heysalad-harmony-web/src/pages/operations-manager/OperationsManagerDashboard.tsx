import { useEffect, useMemo, useState } from 'react';
import { Users, MapPin, Shield, CheckCircle2, AlertCircle, Clock, BookOpen } from 'lucide-react';
import { getTrainingProgressSummary, TrainingProgressSummary } from '../../services/trainingService';

const OperationsManagerDashboard = () => {
  const [trainingSummary, setTrainingSummary] = useState<TrainingProgressSummary | null>(null);

  const teamStats = useMemo(() => {
    const inTraining = trainingSummary ? trainingSummary.inProgress.toString() : '—';
    const floorReady = trainingSummary ? trainingSummary.completed.toString() : '38';
    const totalPrograms = trainingSummary ? trainingSummary.totalPrograms.toString() : '44';

    return [
      { label: 'Team Members', value: '42', icon: Users, color: 'bg-primary' },
      { label: 'Floor Ready', value: floorReady, icon: CheckCircle2, color: 'bg-secondary' },
      { label: 'In Training', value: inTraining, icon: Clock, color: 'bg-accent' },
      { label: 'Training Programs', value: totalPrograms, icon: BookOpen, color: 'bg-green-500' },
    ];
  }, [trainingSummary]);

  const locations = [
    { name: 'Berlin-Mitte Hub', ready: 15, training: 2, total: 17, readiness: 88 },
    { name: 'Berlin-Kreuzberg', ready: 12, training: 1, total: 13, readiness: 92 },
    { name: 'Prenzlauer Berg', ready: 11, training: 1, total: 12, readiness: 92 },
  ];

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const summary = await getTrainingProgressSummary('CEP, E-Commerce, Distribution');
        setTrainingSummary(summary);
      } catch (error) {
        console.error('Failed to fetch training summary for operations manager', error);
      }
    };

    void loadSummary();
  }, []);

  const safetyCompliance = [
    { name: 'Max Müller', role: 'Forklift Operator', cert: 'Forklift', expiry: '2025-12-15', status: 'valid' },
    { name: 'Anna Schmidt', role: 'Warehouse Worker', cert: 'First Aid', expiry: '2025-11-30', status: 'expiring' },
    { name: 'Thomas Weber', role: 'Supervisor', cert: 'Hazmat', expiry: '2026-03-20', status: 'valid' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Operations Manager Dashboard</h1>
        <p className="text-gray-600 mt-1">Team readiness and operational oversight</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Location Breakdown</h3>
        </div>

        <div className="space-y-4">
          {locations.map((location, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{location.name}</h4>
                <span className="text-sm font-medium text-primary">{location.readiness}% Ready</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${location.readiness}%` }}
                />
              </div>

              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-secondary rounded-full" />
                  <span className="text-gray-600">Floor Ready: {location.ready}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded-full" />
                  <span className="text-gray-600">In Training: {location.training}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                  <span className="text-gray-600">Total: {location.total}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-secondary" />
          <h3 className="text-lg font-semibold text-gray-900">Safety Compliance Tracking</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Employee</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Certification</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Expiry Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {safetyCompliance.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600">{item.role}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600">{item.cert}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600">{item.expiry}</p>
                  </td>
                  <td className="py-4 px-4">
                    {item.status === 'valid' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3" />
                        Valid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <AlertCircle className="w-3 h-3" />
                        Expiring Soon
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OperationsManagerDashboard;
