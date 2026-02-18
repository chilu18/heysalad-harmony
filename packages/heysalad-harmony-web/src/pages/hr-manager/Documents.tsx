import { FileText, Folder, Download, Upload, Search, Filter } from 'lucide-react';

const Documents = () => {
  const documentStats = [
    { label: 'Total Documents', value: '1,247', icon: FileText, color: 'bg-blue-500' },
    { label: 'Employee Files', value: '856', icon: Folder, color: 'bg-green-500' },
    { label: 'Company Policies', value: '45', icon: FileText, color: 'bg-purple-500' },
    { label: 'Templates', value: '32', icon: Folder, color: 'bg-yellow-500' },
  ];

  const folders = [
    { name: 'Employment Contracts', count: 247, size: '124 MB', lastUpdated: 'Oct 28, 2024' },
    { name: 'Onboarding Documents', count: 156, size: '89 MB', lastUpdated: 'Oct 30, 2024' },
    { name: 'Performance Reviews', count: 198, size: '45 MB', lastUpdated: 'Oct 25, 2024' },
    { name: 'Training Certificates', count: 324, size: '67 MB', lastUpdated: 'Oct 27, 2024' },
    { name: 'Company Policies', count: 45, size: '23 MB', lastUpdated: 'Sep 15, 2024' },
    { name: 'Legal Documents', count: 89, size: '156 MB', lastUpdated: 'Oct 20, 2024' },
  ];

  const recentDocuments = [
    { name: 'Employment Contract - Sarah Connor.pdf', type: 'Contract', size: '2.4 MB', date: 'Nov 1, 2024' },
    { name: 'Onboarding Package - John Smith.pdf', type: 'Onboarding', size: '5.8 MB', date: 'Oct 31, 2024' },
    { name: 'Performance Review Q3 - Max Schmidt.pdf', type: 'Review', size: '1.2 MB', date: 'Oct 30, 2024' },
    { name: 'Training Certificate - Anna Müller.pdf', type: 'Certificate', size: '0.8 MB', date: 'Oct 29, 2024' },
    { name: 'Company Policy Update - Remote Work.pdf', type: 'Policy', size: '0.5 MB', date: 'Oct 28, 2024' },
  ];

  const templates = [
    { name: 'Employment Contract Template', type: 'Contract', uses: 247 },
    { name: 'Job Offer Letter Template', type: 'Letter', uses: 89 },
    { name: 'Performance Review Form', type: 'Form', uses: 198 },
    { name: 'Termination Letter Template', type: 'Letter', uses: 23 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">Manage HR documents and templates</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {documentStats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Document Folders</h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {folders.map((folder, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Folder className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{folder.name}</h4>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <span>{folder.count} files</span>
                        <span>•</span>
                        <span>{folder.size}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Updated {folder.lastUpdated}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates</h3>
            <div className="space-y-3">
              {templates.map((template, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{template.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Used {template.uses} times</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Documents</h3>
          <div className="space-y-3">
            {recentDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;