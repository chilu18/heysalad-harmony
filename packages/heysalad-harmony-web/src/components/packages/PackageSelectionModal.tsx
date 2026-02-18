import { X, FileText, Globe, DollarSign, Award, BookOpen, Heart } from 'lucide-react';

interface PackageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPackage: (type: string) => void;
}

const PackageSelectionModal = ({ isOpen, onClose, onSelectPackage }: PackageSelectionModalProps) => {
  const packageTypes = [
    {
      type: 'onboarding',
      title: 'Onboarding Package',
      description: 'Complete employee onboarding with documents, training, and setup',
      icon: FileText,
      color: 'bg-blue-500',
      available: true,
    },
    {
      type: 'visa',
      title: 'Visa Package',
      description: 'German work visa application documents and support',
      icon: Globe,
      color: 'bg-green-500',
      available: true,
    },
    {
      type: 'pay',
      title: 'Pay Package',
      description: 'Salary contracts, tax documents, and payment setup',
      icon: DollarSign,
      color: 'bg-yellow-500',
      available: true,
    },
    {
      type: 'bonus',
      title: 'Bonus Package',
      description: 'Performance bonuses, incentives, and rewards documentation',
      icon: Award,
      color: 'bg-purple-500',
      available: true,
    },
    {
      type: 'learning',
      title: 'Learning Package',
      description: 'Training programs and skill development (Coming Soon)',
      icon: BookOpen,
      color: 'bg-indigo-500',
      available: false,
    },
    {
      type: 'wellbeing',
      title: 'Wellbeing Package',
      description: 'Health, wellness, and mental health support (Coming Soon)',
      icon: Heart,
      color: 'bg-pink-500',
      available: false,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Create New Package</h2>
            <p className="text-sm text-gray-600 mt-1">Select the type of package you want to create</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-4">
          {packageTypes.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <button
                key={pkg.type}
                onClick={() => pkg.available && onSelectPackage(pkg.type)}
                disabled={!pkg.available}
                className={`text-left p-6 rounded-xl border-2 transition-all ${
                  pkg.available
                    ? 'border-gray-200 hover:border-primary hover:shadow-lg cursor-pointer'
                    : 'border-gray-100 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${pkg.color} p-3 rounded-lg flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{pkg.title}</h3>
                    <p className="text-sm text-gray-600">{pkg.description}</p>
                    {!pkg.available && (
                      <span className="inline-block mt-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PackageSelectionModal;