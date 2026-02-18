import { X, Download, FileText, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

interface PackageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: any;
}

const PackageViewModal = ({ isOpen, onClose, packageData }: PackageViewModalProps) => {
  const [selectedDoc, setSelectedDoc] = useState(0);

  if (!isOpen || !packageData) return null;

  const documents = packageData.documents || [];
  const currentDoc = documents[selectedDoc];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <div className="h-8 w-px bg-gray-300" />
          <div>
            <h2 className="text-xl font-bold text-secondary">{packageData.employeeName}</h2>
            <p className="text-sm text-gray-600">
              {packageData.role} • {packageData.location}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Document tabs */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {documents.map((doc: any, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedDoc(index)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                selectedDoc === index
                  ? 'border-primary text-primary bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              {doc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Document viewer - Full screen */}
      <div className="flex-1 overflow-hidden bg-gray-100">
        {currentDoc && (
          <div className="h-full flex flex-col">
            {/* Document toolbar */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentDoc.title}
              </h3>
              <a
                href={currentDoc.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>

            {/* PDF Preview - Full height */}
            <div className="flex-1 p-6">
              <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden">
                <iframe
                  src={currentDoc.pdfUrl}
                  className="w-full h-full"
                  title={currentDoc.title}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageViewModal;