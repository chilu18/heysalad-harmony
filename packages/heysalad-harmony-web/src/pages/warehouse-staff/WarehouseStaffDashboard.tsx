import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, ChevronRight, FileText, Download, Calendar, BookOpen } from 'lucide-react';
import { getTrainingProgressSummary, TrainingProgressSummary } from '../../services/trainingService';

const WarehouseStaffDashboard = () => {
  const [checklist, setChecklist] = useState([
    { id: 1, title: 'Safety Training', description: 'Complete workplace safety orientation', completed: true },
    { id: 2, title: 'ID Verified', description: 'Submit identification documents', completed: true },
    { id: 3, title: 'Equipment Request', description: 'Request required work equipment', completed: false },
    { id: 4, title: 'System Access', description: 'Set up warehouse management system', completed: false },
    { id: 5, title: 'Team Introduction', description: 'Meet your team and supervisor', completed: false },
    { id: 6, title: 'First Shift Completion', description: 'Complete your first shift', completed: false },
  ]);

  const [trainingSummary, setTrainingSummary] = useState<TrainingProgressSummary | null>(null);

  const documents = [
    { name: 'Welcome Letter', type: 'PDF', size: '245 KB', date: '2025-10-01' },
    { name: 'Employment Contract', type: 'PDF', size: '512 KB', date: '2025-10-01' },
    { name: 'Safety Guidelines', type: 'PDF', size: '1.2 MB', date: '2025-10-01' },
    { name: 'First Week Schedule', type: 'PDF', size: '156 KB', date: '2025-10-01' },
  ];

  const completedCount = checklist.filter(item => item.completed).length;
  const progress = (completedCount / checklist.length) * 100;
  const trainingProgressPercent = trainingSummary && trainingSummary.totalPrograms > 0
    ? Math.round((trainingSummary.completed / trainingSummary.totalPrograms) * 100)
    : 0;

  const toggleChecklistItem = (id: number) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  useEffect(() => {
    const loadTrainingSummary = async () => {
      try {
        const summary = await getTrainingProgressSummary('Airport Technology');
        setTrainingSummary(summary);
      } catch (error) {
        console.error('Failed to fetch warehouse training summary', error);
      }
    };

    void loadTrainingSummary();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Onboarding</h1>
        <p className="text-gray-600 mt-1">Complete your onboarding checklist</p>
      </div>

      <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Onboarding Progress</h3>
            <p className="text-sm text-gray-600 mt-1">
              {completedCount} of {checklist.length} tasks completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">{Math.round(progress)}%</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {trainingSummary && (
        <div className="card border-secondary/40 bg-secondary/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" />
                Training Progress
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {trainingSummary.completed} of {trainingSummary.totalPrograms} BEUMER modules completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-secondary">{trainingProgressPercent}%</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-secondary h-3 rounded-full transition-all duration-500"
              style={{ width: `${trainingProgressPercent}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm text-gray-600 mt-4">
            <div>
              <p className="font-semibold text-gray-900">{trainingSummary.completed}</p>
              <p>Completed</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{trainingSummary.inProgress}</p>
              <p>In Progress</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{trainingSummary.notStarted}</p>
              <p>Not Started</p>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Checklist</h3>
        <div className="space-y-3">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                item.completed
                  ? 'border-secondary bg-secondary/5'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {item.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1 text-left">
                <h4 className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
            </button>
          ))}
        </div>

        {progress === 100 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800">
              Congratulations! You've completed all onboarding tasks. Welcome to the team!
            </p>
          </div>
        )}

        {progress < 100 && (
          <button className="w-full mt-6 btn-accent">
            Continue Onboarding
          </button>
        )}
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">My Documents</h3>
        </div>

        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{doc.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {doc.date}
                    </span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WarehouseStaffDashboard;
