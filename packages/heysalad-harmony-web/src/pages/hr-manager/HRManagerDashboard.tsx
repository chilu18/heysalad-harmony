import { useState, useEffect, useMemo } from 'react';
import { Users, Package, CheckCircle, Plus, TrendingUp, Search, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PackageSelectionModal from '../../components/packages/PackageSelectionModal';
import CreatePackageModal from '../../components/onboarding/CreatePackageModal';
import CreateVisaPackageModal from '../../components/packages/CreateVisaPackageModal';
import PackageViewModal from '../../components/onboarding/PackageViewModal';
import { getOnboardingPackages } from '../../services/packageService';
import { getTrainingProgressSummary, TrainingProgressSummary } from '../../services/trainingService';

const HRManagerDashboard = () => {
  const [showPackageSelection, setShowPackageSelection] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showVisaModal, setShowVisaModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trainingSummary, setTrainingSummary] = useState<TrainingProgressSummary | null>(null);

  const stats = useMemo(() => {
    const trainingPercent = trainingSummary && trainingSummary.totalPrograms > 0
      ? Math.round((trainingSummary.completed / trainingSummary.totalPrograms) * 100)
      : 0;

    return [
      {
        label: 'Active Employees',
        value: '247',
        change: '+12',
        icon: Users,
        color: 'bg-blue-500',
      },
      {
        label: 'Pending Packages',
        value: '18',
        change: '+5',
        icon: Package,
        color: 'bg-accent',
      },
      {
        label: 'Compliance Rate',
        value: '88%',
        change: '+3%',
        icon: CheckCircle,
        color: 'bg-secondary',
      },
      {
        label: 'Training Completion',
        value: trainingSummary
          ? `${trainingSummary.completed}/${trainingSummary.totalPrograms}`
          : '—',
        change: trainingSummary ? `${trainingPercent}% complete` : 'Sync catalog',
        icon: BookOpen,
        color: 'bg-primary',
      },
      {
        label: 'Avg. Time to Productivity',
        value: '16 days',
        change: '-2 days',
        icon: TrendingUp,
        color: 'bg-indigo-500',
      },
    ];
  }, [trainingSummary]);

  const timeToProductivityData = [
    { role: 'Warehouse', days: 12 },
    { role: 'Forklift Op', days: 18 },
    { role: 'Supervisor', days: 21 },
    { role: 'Operations', days: 25 },
  ];

  const loadPackages = async () => {
    setLoading(true);
    const result = await getOnboardingPackages();
    if (result.success) {
      setPackages(result.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    const loadTrainingSummary = async () => {
      try {
        const summary = await getTrainingProgressSummary();
        setTrainingSummary(summary);
      } catch (error) {
        console.error('Failed to fetch training summary', error);
      }
    };

    void loadTrainingSummary();
  }, []);

  const handlePackageCreated = () => {
    loadPackages();
  };

  const handlePackageTypeSelected = (type: string) => {
    setShowPackageSelection(false);
    if (type === 'onboarding') {
      setShowOnboardingModal(true);
    } else if (type === 'visa') {
      setShowVisaModal(true);
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">HR Manager Dashboard</h1>
            <p className="text-zinc-400 mt-1">Manage packages and employee lifecycle</p>
          </div>
          <button 
            onClick={() => setShowPackageSelection(true)}
            className="bg-[#E01D1D] hover:bg-[#c91919] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Package
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#1a1a1a] rounded-xl shadow-sm border border-zinc-800 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-400 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  <p className="text-sm text-green-500 font-medium mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl shadow-sm border border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Time to Productivity by Role</h3>
              <p className="text-sm text-zinc-400 mt-1">Average days until employees reach full productivity</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeToProductivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="role" stroke="#999" fontSize={12} />
              <YAxis stroke="#999" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="days" fill="#E01D1D" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl shadow-sm border border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Packages</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search packages..."
                className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-[#E01D1D] focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#E01D1D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-zinc-400">Loading packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 mb-4">No packages yet</p>
              <button
                onClick={() => setShowPackageSelection(true)}
                className="text-[#E01D1D] hover:text-[#c91919] font-semibold"
              >
                Create your first package
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-300">Employee</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-300">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-300">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-300">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-300">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                      <td className="py-4 px-4">
                        <p className="text-sm font-medium text-white">{pkg.employeeName}</p>
                        <p className="text-xs text-zinc-500">{pkg.email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
                          {pkg.packageType || 'Onboarding'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-zinc-400">{pkg.role}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-zinc-400">{pkg.location}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-zinc-400">{pkg.startDate}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            pkg.status === 'active'
                              ? 'bg-green-900/30 text-green-400'
                              : pkg.status === 'completed'
                              ? 'bg-blue-900/30 text-blue-400'
                              : 'bg-yellow-900/30 text-yellow-400'
                          }`}
                        >
                          {pkg.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => setSelectedPackage(pkg)}
                          className="text-sm text-[#E01D1D] hover:text-[#c91919] font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <PackageSelectionModal
        isOpen={showPackageSelection}
        onClose={() => setShowPackageSelection(false)}
        onSelectPackage={handlePackageTypeSelected}
      />

      <CreatePackageModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onSuccess={handlePackageCreated}
      />

      <CreateVisaPackageModal
        isOpen={showVisaModal}
        onClose={() => setShowVisaModal(false)}
        onSuccess={handlePackageCreated}
      />

      <PackageViewModal
        isOpen={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
        packageData={selectedPackage}
      />
    </>
  );
};

export default HRManagerDashboard;
