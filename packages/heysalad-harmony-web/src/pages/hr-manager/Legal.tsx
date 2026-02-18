import { FileText, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';

const Legal = () => {
  const legalStats = [
    { label: 'Active Contracts', value: '247', icon: FileText, color: 'bg-blue-500' },
    { label: 'Expiring Soon', value: '12', icon: Clock, color: 'bg-yellow-500' },
    { label: 'Compliance Score', value: '96%', icon: Shield, color: 'bg-green-500' },
    { label: 'Open Cases', value: '3', icon: AlertTriangle, color: 'bg-red-500' },
  ];

  const contracts = [
    { employee: 'Max Schmidt', type: 'Permanent', startDate: 'Jan 15, 2023', endDate: 'Unlimited', status: 'active', review: 'Jan 2025' },
    { employee: 'Anna Müller', type: 'Permanent', startDate: 'Mar 20, 2023', endDate: 'Unlimited', status: 'active', review: 'Mar 2025' },
    { employee: 'Thomas Weber', type: 'Fixed-term', startDate: 'Jun 1, 2023', endDate: 'May 31, 2025', status: 'expiring', review: 'Dec 2024' },
    { employee: 'Laura Fischer', type: 'Permanent', startDate: 'Feb 10, 2023', endDate: 'Unlimited', status: 'active', review: 'Feb 2025' },
  ];

  const complianceItems = [
    { item: 'GDPR Data Protection', status: 'compliant', lastReview: 'Oct 15, 2024', nextReview: 'Jan 15, 2025' },
    { item: 'Working Time Regulations', status: 'compliant', lastReview: 'Oct 20, 2024', nextReview: 'Jan 20, 2025' },
    { item: 'Health & Safety', status: 'action-needed', lastReview: 'Sep 30, 2024', nextReview: 'Nov 5, 2024' },
    { item: 'Equal Opportunities', status: 'compliant', lastReview: 'Oct 10, 2024', nextReview: 'Jan 10, 2025' },
  ];

  const legalCases = [
    { id: 'LC-2024-003', type: 'Contract Dispute', employee: 'John Doe', status: 'in-progress', priority: 'high', opened: 'Oct 15, 2024' },
    { id: 'LC-2024-002', type: 'Workplace Complaint', employee: 'Jane Smith', status: 'under-review', priority: 'medium', opened: 'Oct 10, 2024' },
    { id: 'LC-2024-001', type: 'Termination Review', employee: 'Bob Johnson', status: 'closed', priority: 'low', opened: 'Sep 20, 2024' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Legal</h1>
            <p className="text-gray-600 mt-1">Contracts, compliance, and legal matters</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
            <FileText className="w-4 h-4" />
            Generate Contract
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {legalStats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Contracts</h3>
            <div className="space-y-3">
              {contracts.map((contract, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{contract.employee}</h4>
                      <p className="text-sm text-gray-600 mt-1">{contract.type} Contract</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      contract.status === 'active' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <div>
                      <span className="text-gray-500">Start:</span> {contract.startDate}
                    </div>
                    <div>
                      <span className="text-gray-500">End:</span> {contract.endDate}
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Next Review:</span> {contract.review}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status</h3>
            <div className="space-y-3">
              {complianceItems.map((item, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{item.item}</h4>
                    {item.status === 'compliant' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Review:</span>
                      <span>{item.lastReview}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Next Review:</span>
                      <span>{item.nextReview}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Cases</h3>
          <div className="space-y-3">
            {legalCases.map((legalCase, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{legalCase.id}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        legalCase.priority === 'high' ? 'bg-red-100 text-red-700' :
                        legalCase.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {legalCase.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        legalCase.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                        legalCase.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {legalCase.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{legalCase.type}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Employee: {legalCase.employee}</span>
                      <span>Opened: {legalCase.opened}</span>
                    </div>
                  </div>
                  <button className="text-sm text-primary hover:text-primary-dark font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;