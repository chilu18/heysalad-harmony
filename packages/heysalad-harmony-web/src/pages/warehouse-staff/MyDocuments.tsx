import { FileText, Download, Eye, Calendar } from 'lucide-react';

const MyDocuments = () => {
  const documents = [
    { name: 'Employment Contract', type: 'Contract', date: '15 Jan 2024', size: '2.4 MB', status: 'signed' },
    { name: 'Safety Training Certificate', type: 'Certificate', date: '20 Jan 2024', size: '1.2 MB', status: 'verified' },
    { name: 'Forklift License', type: 'License', date: '22 Jan 2024', size: '0.8 MB', status: 'active' },
    { name: 'ID Verification', type: 'Identity', date: '15 Jan 2024', size: '1.5 MB', status: 'verified' },
    { name: 'Bank Details Form', type: 'Finance', date: '15 Jan 2024', size: '0.5 MB', status: 'approved' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-600 mt-1">Access your personal work documents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <FileText className="w-8 h-8 mb-3" />
            <p className="text-sm opacity-90">Total Documents</p>
            <p className="text-3xl font-bold mt-1">5</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <Calendar className="w-8 h-8 mb-3" />
            <p className="text-sm opacity-90">Last Updated</p>
            <p className="text-3xl font-bold mt-1">Today</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <Download className="w-8 h-8 mb-3" />
            <p className="text-sm opacity-90">Available</p>
            <p className="text-3xl font-bold mt-1">All</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Documents</h3>
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'signed' || doc.status === 'verified' || doc.status === 'active' || doc.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {doc.status}
                  </span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-gray-600" />
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

export default MyDocuments;