import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Loader2, FileText, Globe } from 'lucide-react';
import { useAuth } from '../../App';
import { generateVisaDocuments } from '../../services/visaAiService';
import { createVisaPackage } from '../../services/visaPackageService';

interface CreateVisaPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateVisaPackageModal = ({ isOpen, onClose, onSuccess }: CreateVisaPackageModalProps) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDocument, setCurrentDocument] = useState('');

  const [formData, setFormData] = useState({
    employeeName: '',
    email: '',
    nationality: '',
    currentLocation: '',
    visaType: '',
    jobTitle: '',
    salary: '',
    startDate: '',
    educationLevel: '',
    yearsExperience: '',
    germanLevel: '',
    hasJobOffer: true,
  });

  const visaTypes = [
    {
      value: 'blue-card',
      title: 'EU Blue Card',
      description: 'For highly qualified professionals with university degree',
      requirements: 'University degree + Job offer with €43,800+ salary (€40,770 for shortage occupations)',
    },
    {
      value: 'chancenkarte',
      title: 'Chancenkarte (Opportunity Card)',
      description: 'Points-based system for job seekers',
      requirements: 'Points based on qualifications, age, German language skills, and ties to Germany',
    },
    {
      value: 'service-provider',
      title: 'Service Provider',
      description: 'For self-employed professionals providing services',
      requirements: 'Business plan + Proof of professional qualifications + Client contracts',
    },
    {
      value: 'self-employed',
      title: 'Self-Employed',
      description: 'For entrepreneurs and freelancers',
      requirements: 'Viable business idea + Financial resources + Benefit to German economy',
    },
    {
      value: 'intra-company-transfer',
      title: 'Intra-Company Transfer (ICT)',
      description: 'For employees transferred within the same company',
      requirements: 'Employment with same company for 3-6 months + Specialized knowledge',
    },
  ];

  const resetForm = () => {
    setStep(1);
    setProgress(0);
    setCurrentDocument('');
    setFormData({
      employeeName: '',
      email: '',
      nationality: '',
      currentLocation: '',
      visaType: '',
      jobTitle: '',
      salary: '',
      startDate: '',
      educationLevel: '',
      yearsExperience: '',
      germanLevel: '',
      hasJobOffer: true,
    });
  };

  const handleSubmit = async () => {
    console.log('=== VISA PACKAGE SUBMIT STARTED ===');
    console.log('Form data:', formData);
    console.log('Current user:', currentUser);
    
    if (!currentUser) {
      console.error('ERROR: No current user');
      alert('You must be logged in');
      return;
    }

    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('Loading state set to true');
    setProgress(0);
    setCurrentDocument('Starting generation...');

    try {
      const params = {
        employeeName: formData.employeeName,
        email: formData.email,
        nationality: formData.nationality,
        currentLocation: formData.currentLocation,
        visaType: formData.visaType,
        jobTitle: formData.jobTitle,
        salary: formData.salary,
        startDate: formData.startDate,
        educationLevel: formData.educationLevel,
        yearsExperience: formData.yearsExperience,
        germanLevel: formData.germanLevel,
      };

      console.log('Params prepared:', params);
      console.log('About to call generateVisaDocuments...');

      const documents = await generateVisaDocuments(params, (prog, docName) => {
        console.log(`Progress update: ${prog}% - ${docName}`);
        setProgress(prog);
        setCurrentDocument(docName);
      });

      console.log('Documents generated:', documents);

      const packageData = {
        ...formData,
        documents,
        packageType: 'visa' as const,
        status: 'active' as const,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
      };

      console.log('About to save package...');
      const result = await createVisaPackage(packageData);
      console.log('Package save result:', result);

      if (result.success) {
        setProgress(100);
        setCurrentDocument('Complete!');
        
        setTimeout(() => {
          onSuccess();
          onClose();
          resetForm();
        }, 1000);
      } else {
        throw new Error('Failed to save package');
      }
    } catch (error) {
      console.error('ERROR in handleSubmit:', error);
      alert(`Error: ${error}`);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary flex items-center gap-2">
              <Globe className="w-7 h-7 text-primary" />
              Create Visa Package
            </h2>
            <p className="text-sm text-gray-600 mt-1">Step {step} of 4</p>
          </div>
          <button onClick={onClose} disabled={loading} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary mb-4">Employee Information</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nationality *</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Turkish, Indian, Brazilian"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Location *</label>
                <input
                  type="text"
                  value={formData.currentLocation}
                  onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Istanbul, Mumbai, São Paulo"
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary mb-4">Select Visa Type</h3>
              
              <div className="space-y-3">
                {visaTypes.map((visa) => (
                  <button
                    key={visa.value}
                    onClick={() => setFormData({ ...formData, visaType: visa.value })}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      formData.visaType === visa.value
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                        formData.visaType === visa.value ? 'border-primary bg-primary' : 'border-gray-300'
                      }`}>
                        {formData.visaType === visa.value && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{visa.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{visa.description}</p>
                        <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                          <strong>Requirements:</strong> {visa.requirements}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary mb-4">Job & Qualifications</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Software Engineer, Operations Manager"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Gross Salary (€) *</label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 55000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Proposed Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Education Level *</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select education level...</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD/Doctorate</option>
                  <option value="vocational">Vocational Training</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Professional Experience *</label>
                <input
                  type="number"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">German Language Level</label>
                <select
                  value={formData.germanLevel}
                  onChange={(e) => setFormData({ ...formData, germanLevel: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select level...</option>
                  <option value="none">None</option>
                  <option value="a1">A1 - Beginner</option>
                  <option value="a2">A2 - Elementary</option>
                  <option value="b1">B1 - Intermediate</option>
                  <option value="b2">B2 - Upper Intermediate</option>
                  <option value="c1">C1 - Advanced</option>
                  <option value="c2">C2 - Proficient</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">Review & Generate</h3>
              
              {!loading ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Application Details</h4>
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
                        <span className="text-gray-600">Nationality:</span>
                        <p className="font-medium">{formData.nationality}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Current Location:</span>
                        <p className="font-medium">{formData.currentLocation}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Visa Type:</span>
                        <p className="font-medium">{visaTypes.find(v => v.value === formData.visaType)?.title}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Job Title:</span>
                        <p className="font-medium">{formData.jobTitle}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Salary:</span>
                        <p className="font-medium">€{formData.salary}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Start Date:</span>
                        <p className="font-medium">{formData.startDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-xl p-4 border-2 border-primary/20">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Documents to be Generated
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-7">
                      <li>• Job Description (German & English)</li>
                      <li>• Employment Contract (Arbeitsvertrag)</li>
                      <li>• Visa Application Form</li>
                      <li>• Employer Declaration (Arbeitgebererklärung)</li>
                      <li>• Qualification Recognition Guide</li>
                      <li>• Checklist for Visa Application</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Generating Visa Package</h4>
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
                (step === 1 && (!formData.employeeName || !formData.email || !formData.nationality || !formData.currentLocation)) ||
                (step === 2 && !formData.visaType) ||
                (step === 3 && (!formData.jobTitle || !formData.salary || !formData.startDate || !formData.educationLevel || !formData.yearsExperience))
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

export default CreateVisaPackageModal;