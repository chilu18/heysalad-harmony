import { Calendar, Clock, MapPin, User } from 'lucide-react';

const MySchedule = () => {
  const shifts = [
    { day: 'Monday', date: 'Nov 4', time: '08:00 - 16:00', location: 'Berlin Hub', supervisor: 'Max Schmidt', type: 'morning' },
    { day: 'Tuesday', date: 'Nov 5', time: '08:00 - 16:00', location: 'Berlin Hub', supervisor: 'Max Schmidt', type: 'morning' },
    { day: 'Wednesday', date: 'Nov 6', time: '14:00 - 22:00', location: 'Berlin Hub', supervisor: 'Anna Müller', type: 'afternoon' },
    { day: 'Thursday', date: 'Nov 7', time: '08:00 - 16:00', location: 'Berlin Hub', supervisor: 'Max Schmidt', type: 'morning' },
    { day: 'Friday', date: 'Nov 8', time: '08:00 - 16:00', location: 'Berlin Hub', supervisor: 'Max Schmidt', type: 'morning' },
  ];

  const upcomingShift = shifts[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-600 mt-1">View your upcoming shifts</p>
        </div>

        <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">Next Shift</p>
              <h2 className="text-3xl font-bold mt-1">{upcomingShift.day}</h2>
              <p className="text-lg mt-1">{upcomingShift.date}</p>
            </div>
            <Calendar className="w-12 h-12" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{upcomingShift.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{upcomingShift.location}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Schedule</h3>
          <div className="space-y-3">
            {shifts.map((shift, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{shift.day}, {shift.date}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      {shift.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    shift.type === 'morning' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {shift.type}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{shift.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{shift.supervisor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Hours This Week</span>
            <span className="text-2xl font-bold text-primary">40h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySchedule;