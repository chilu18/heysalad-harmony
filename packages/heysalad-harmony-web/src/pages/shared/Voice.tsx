import { useState, useEffect } from 'react';
import { Mic, Play, Square, Download, MessageCircle, Volume2, Settings } from 'lucide-react';

const Voice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const stats = [
    {
      label: 'Total Recordings',
      value: '48',
      change: '+12',
      icon: MessageCircle,
      color: 'bg-blue-500',
    },
    {
      label: 'This Month',
      value: '15',
      change: '+5',
      icon: Mic,
      color: 'bg-accent',
    },
    {
      label: 'Total Duration',
      value: '6h 24m',
      change: '+1h 12m',
      icon: Volume2,
      color: 'bg-secondary',
    },
    {
      label: 'Storage Used',
      value: '2.4 GB',
      change: '+0.8 GB',
      icon: Download,
      color: 'bg-primary',
    },
  ];

  const mockRecordings = [
    {
      id: 1,
      title: 'Safety Briefing - January',
      duration: '15:24',
      date: '2024-01-15',
      size: '45 MB',
      type: 'Meeting',
    },
    {
      id: 2,
      title: 'Team Training Session',
      duration: '32:18',
      date: '2024-01-12',
      size: '98 MB',
      type: 'Training',
    },
    {
      id: 3,
      title: 'Daily Operations Update',
      duration: '8:42',
      date: '2024-01-11',
      size: '25 MB',
      type: 'Update',
    },
    {
      id: 4,
      title: 'Interview Notes - Candidate A',
      duration: '22:15',
      date: '2024-01-10',
      size: '65 MB',
      type: 'Interview',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRecordings(mockRecordings);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop the recording
  };

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would play/pause the recording
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Meeting': return 'bg-blue-100 text-blue-700';
      case 'Training': return 'bg-green-100 text-green-700';
      case 'Update': return 'bg-purple-100 text-purple-700';
      case 'Interview': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Voice Notes</h1>
            <p className="text-gray-600 mt-1">Record and manage voice notes and meetings</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white shadow-lg">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              {isRecording ? (
                <Square className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {isRecording ? 'Recording in Progress...' : 'Ready to Record'}
            </h2>
            <p className="text-lg mb-6 opacity-90">
              {isRecording 
                ? 'Click stop to save your recording' 
                : 'Record meetings, notes, or training sessions'
              }
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleRecordToggle}
                className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all shadow-lg ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-white text-primary hover:bg-gray-100'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-6 h-6" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6" />
                    Start Recording
                  </>
                )}
              </button>
              {isPlaying ? (
                <button
                  onClick={handlePlayToggle}
                  className="px-6 py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-lg flex items-center gap-3 transition-all"
                >
                  <Square className="w-5 h-5" />
                  Stop
                </button>
              ) : (
                <button
                  onClick={handlePlayToggle}
                  className="px-6 py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-lg flex items-center gap-3 transition-all"
                >
                  <Play className="w-5 h-5" />
                  Play
                </button>
              )}
            </div>
            {isRecording && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm opacity-75">Recording...</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Recordings</h3>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export All
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading recordings...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Size</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recordings.map((recording) => (
                    <tr key={recording.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                            <Mic className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{recording.title}</p>
                            <p className="text-xs text-gray-500">Voice recording</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(recording.type)}`}>
                          {recording.type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">{recording.duration}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">{recording.date}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">{recording.size}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <Square className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Voice;
