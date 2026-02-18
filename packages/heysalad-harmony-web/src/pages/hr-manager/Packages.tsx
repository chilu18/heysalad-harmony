import { useState } from 'react';
import { Package, Plus, Search, Filter, DollarSign, Award, FileText } from 'lucide-react';
import PackageSelectionModal from '../../components/packages/PackageSelectionModal';
import CreatePackageModal from '../../components/onboarding/CreatePackageModal';
import CreateVisaPackageModal from '../../components/packages/CreateVisaPackageModal';

const Packages = () => {
  const [showPackageSelection, setShowPackageSelection] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showVisaModal, setShowVisaModal] = useState(false);

  const packageStats = [
    { label: 'Total Packages', value: '156', icon: Package, color: 'bg-blue-500' },
    { label: 'Active', value: '89', icon: FileText, color: 'bg-green-500' },
    { label: 'Pending', value: '18', icon: Award, color: 'bg-yellow-500' },
    { label: 'Completed', value: '49', icon: DollarSign, color: 'bg-purple-500' },
  ];

  const packages = [
    { id: 'PKG-2024-156', employee: 'Max Schmidt', type: 'Onboarding', status: 'active', date: 'Oct 28, 2024', progress: 75 },
    { id: 'PKG-2024-155', employee: 'Anna Müller', type: 'Visa', status: 'active', date: 'Oct 25, 2024', progress: 60 },
    { id: 'PKG-2024-154', employee: 'Thomas Weber', type: 'Pay', status: 'pending', date: 'Oct 22, 2024', progress: 30 },
    { id: 'PKG-2024-153', employee: 'Laura Fischer', type: 'Bonus', status: 'completed', date: 'Oct 20, 2024', progress: 100 },
    { id: 'PKG-2024-152', employee: 'Michael Becker', type: 'Onboarding', status: 'active', date: 'Oct 18, 2024', progress: 85 },
  ];

  const handlePackageTypeSelected = (type: string) => {
    setShowPackageSelection(false);
    if (type === 'onboarding') {
      setShowOnboardingModal(true);
    } else if (type === 'visa') {
      setShowVisaModal(true);
    }
  };

  const handlePackageCreated = () => {
    // Refresh package list
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Packages</h1>
              <p className="text-gray-600 mt-1">Manage employee packages and documentation</p>
            </div>
            <button
              onClick={() => setShowPackageSelection(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Package
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packageStats.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
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

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">All Packages</h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search packages..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Package ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Employee</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Progress</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-white transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-900">{pkg.id}</td>
                      <td className="py-4 px-4 text-gray-600">{pkg.employee}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {pkg.type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          pkg.status === 'active' ? 'bg-green-100 text-green-700' :
                          pkg.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {pkg.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${pkg.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{pkg.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{pkg.date}</td>
                      <td className="py-4 px-4">
                        <button className="text-sm text-primary hover:text-primary-dark font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
    </>
  );
};

export default Packages;