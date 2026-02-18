import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Loader2, FileText } from 'lucide-react';
import { generateAllDocuments, DocumentGenerationParams } from '../../services/aiService';
import { createOnboardingPackage } from '../../services/packageService';
import { useAuth } from '../../App';

interface CreatePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePackageModal = ({ isOpen, onClose, onSuccess }: CreatePackageModalProps) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDocument, setCurrentDocument] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    employeeName: '',
    email: '',
    role: '',
    startDate: '',
    location: '',
    department: '',
    reportingManager: '',
    certifications: [] as string[],
    language: 'German',
    // Additional fields
    systemAccess: [] as string[],
    vpnAccess: false,
    emailSetup: true,
    equipmentNeeded: [] as string[],
  });

  const roles = [
    'Warehouse Worker',
    'Forklift Operator',
    'Shift Supervisor',
    'Operations Manager',
    'Logistics Coordinator',
  ];

  const locations = [
    'Berlin-Mitte Hub',
    'Berlin-Kreuzberg Warehouse',
    'Berlin-Prenzlauer Berg Fulfillment Center',
    'Hamburg Logistics Center',
  ];

  const certifications = ['Forklift', 'Hazmat', 'First Aid', 'DGUV'];
  const systemAccessOptions = ['WMS', 'ERP', 'Time Tracking', 'Email', 'Slack'];
  const equipmentOptions = ['Laptop', 'Safety Vest', 'Scanner', 'Radio', 'Locker'];

  const handleSubmit = async () => {
    if (!currentUser) return;

    setLoading(true);
    setProgress(0);
    setCurrentDocument('Starting generation...');

    try {
      // Prepare document generation parameters
      const params: DocumentGenerationParams = {
        employeeName: formData.employeeName,
        role: formData.role,
        location: formData.location,
        startDate: formData.startDate,
        department: formData.department,
        reportingManager: formData.reportingManager,
        language: formData.language,
        certifications: formData.certifications,
      };

      // Generate documents with AI
      const documents = await generateAllDocuments(params, (prog, docName) => {
        setProgress(prog);
        setCurrentDocument(docName);
      });

      // Create package in Firestore with all details
      const packageData = {
        ...formData,
        documents,
        status: 'active' as const,
        progress: 85,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await createOnboardingPackage(packageData);

      setProgress(100);
      setCurrentDocument('Complete!');
      
      setTimeout(() => {
        onSuccess();
        onClose();
        resetForm();
      }, 1000);
    } catch (error) {
      console.error('Error creating package:', error);
      alert('Failed to create onboarding package. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setProgress(0);
    setCurrentDocument('');
    setFormData({
      employeeName: '',
      email: '',
      role: '',
      startDate: '',
      location: '',
      department: '',
      reportingManager: '',
      certifications: [],
      language: 'German',
      systemAccess: [],
      vpnAccess: false,
      emailSetup: true,
      equipmentNeeded: [],
    });
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Create Onboarding Package</h2>
            <p className="text-sm text-gray-600 mt-1">Step {step} of 4</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-all ${
                  s <= step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Employee Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary mb-4">Employee Information</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Max Müller"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="max.muller@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select role...</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Location & Department */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary mb-4">Location & Department</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select location...</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Warehouse Operations"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reporting Manager *
                </label>
                <input
                  type="text"
                  value={formData.reportingManager}
                  onChange={(e) => setFormData({ ...formData, reportingManager: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Anna Schmidt"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Required Certifications
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {certifications.map((cert) => (
                    <label
                      key={cert}
                      className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.certifications.includes(cert)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.certifications.includes(cert)}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            certifications: toggleArrayItem(formData.certifications, cert),
                          })
                        }
                        className="w-4 h-4 text-primary rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Primary Language *
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="German">German</option>
                  <option value="English">English</option>
                  <option value="Turkish">Turkish</option>
                  <option value="Polish">Polish</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: System Access & Equipment */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">System Access & Equipment</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  System Access Required
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {systemAccessOptions.map((system) => (
                    <label
                      key={system}
                      className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.systemAccess.includes(system)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.systemAccess.includes(system)}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            systemAccess: toggleArrayItem(formData.systemAccess, system),
                          })
                        }
                        className="w-4 h-4 text-primary rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{system}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">VPN Access</p>
                  <p className="text-sm text-gray-600">Secure remote access</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.vpnAccess}
                  onChange={(e) => setFormData({ ...formData, vpnAccess: e.target.checked })}
                  className="w-5 h-5 text-primary rounded"
                />
              </div>

              <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">Email Setup</p>
                  <p className="text-sm text-gray-600">Company email account</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.emailSetup}
                  onChange={(e) => setFormData({ ...formData, emailSetup: e.target.checked })}
                  className="w-5 h-5 text-primary rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Equipment Needed
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {equipmentOptions.map((equipment) => (
                    <label
                      key={equipment}
                      className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.equipmentNeeded.includes(equipment)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.equipmentNeeded.includes(equipment)}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            equipmentNeeded: toggleArrayItem(formData.equipmentNeeded, equipment),
                          })
                        }
                        className="w-4 h-4 text-primary rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{equipment}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Generate */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">Review & Generate</h3>
              
              {!loading ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Employee Details</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <p className="font-medium">{formData.employeeName}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Role:</span>
                        <p className="font-medium">{formData.role}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Start Date:</span>
                        <p className="font-medium">{formData.startDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <p className="font-medium">{formData.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Department:</span>
                        <p className="font-medium">{formData.department}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-xl p-4 border-2 border-primary/20">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Documents to be Generated
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-7">
                      <li>• Welcome Letter (Bilingual)</li>
                      <li>• Arbeitsvertrag (Employment Contract)</li>
                      <li>• Datenschutzerklärung (GDPR)</li>
                      <li>• Safety Instructions (DGUV)</li>
                      <li>• First Week Schedule</li>
                      <li>• Location Guide</li>
                    </ul>
                  </div>

                  {formData.systemAccess.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">System Access</h4>
                      <p className="text-sm text-gray-700">{formData.systemAccess.join(', ')}</p>
                    </div>
                  )}

                  {formData.equipmentNeeded.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Equipment</h4>
                      <p className="text-sm text-gray-700">{formData.equipmentNeeded.join(', ')}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Generating Documents with AI
                  </h4>
                  <p className="text-gray-600 mb-4">{currentDocument}</p>
                  <div className="max-w-md mx-auto">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}%</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || loading}
            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && (!formData.employeeName || !formData.email || !formData.role || !formData.startDate)) ||
                (step === 2 && (!formData.location || !formData.department || !formData.reportingManager))
              }
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Package
                  <FileText className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePackageModal;