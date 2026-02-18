import { useState, useEffect } from 'react';
import { Clock, Play, Square, Calendar, Download } from 'lucide-react';

const Timesheets = () => {
  const [isClocked, setIsClocked] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: number | undefined;
    
    if (isClocked) {
      interval = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClocked]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClockToggle = () => {
    if (!isClocked) {
      setStartTime(Date.now());
      setIsClocked(true);
    } else {
      // Clock out - save timesheet entry here
      setIsClocked(false);
      setElapsedSeconds(0);
      setStartTime(null);
    }
  };

  const weekData = [
    { day: 'Monday', date: 'Oct 28', hours: '8h 30m', status: 'approved' },
    { day: 'Tuesday', date: 'Oct 29', hours: '8h 15m', status: 'approved' },
    { day: 'Wednesday', date: 'Oct 30', hours: '8h 45m', status: 'approved' },
    { day: 'Thursday', date: 'Oct 31', hours: '8h 00m', status: 'pending' },
    { day: 'Friday', date: 'Nov 01', hours: '--', status: 'today' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Timesheets</h1>
            <p className="text-gray-600 mt-1">Track your working hours</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white shadow-lg">
          <div className="text-center">
            <Clock className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-5xl font-bold mb-2 font-mono">{formatTime(elapsedSeconds)}</h2>
            <p className="text-lg mb-6 opacity-90">
              {isClocked ? 'Session Started' : 'Ready to Clock In'}
            </p>
            <button
              onClick={handleClockToggle}
              className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 mx-auto transition-all shadow-lg ${
                isClocked ? 'bg-red-500 hover:bg-red-600' : 'bg-white text-primary hover:bg-gray-100'
              }`}
            >
              {isClocked ? <Square className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              {isClocked ? 'Clock Out' : 'Clock In'}
            </button>
            {isClocked && startTime && (
              <p className="mt-4 text-sm opacity-75">
                Started at {new Date(startTime).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
          <div className="space-y-3">
            {weekData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{entry.day}</p>
                    <p className="text-sm text-gray-500">{entry.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">{entry.hours}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    entry.status === 'approved' ? 'bg-green-100 text-green-700' :
                    entry.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {entry.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total This Week</span>
            <span className="text-2xl font-bold text-primary">33h 30m</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timesheets;