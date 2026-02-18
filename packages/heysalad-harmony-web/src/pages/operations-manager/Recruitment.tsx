import { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, Eye, Calendar, MapPin, Briefcase, CheckCircle } from 'lucide-react';

const Recruitment = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    {
      label: 'Team Openings',
      value: '8',
      change: '+2',
      icon: Briefcase,
      color: 'bg-blue-500',
    },
    {
      label: 'Candidates to Review',
      value: '24',
      change: '+6',
      icon: Users,
      color: 'bg-accent',
    },
    {
      label: 'Interviews Scheduled',
      value: '12',
      change: '+3',
      icon: Calendar,
      color: 'bg-secondary',
    },
    {
      label: 'Approval Rate',
      value: '85%',
      change: '+5%',
      icon: CheckCircle,
      color: 'bg-primary',
    },
  ];

  const mockCandidates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Warehouse Supervisor',
      location: 'Berlin',
      status: 'Needs Review',
      stage: 'HR Screening',
      appliedDate: '2024-01-15',
      experience: '5 years',
      avatar: 'SJ',
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'Forklift Operator',
      location: 'Hamburg',
      status: 'Ready for Interview',
      stage: 'Ops Review',
      appliedDate: '2024-01-14',
      experience: '3 years',
      avatar: 'MC',
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      position: 'Logistics Coordinator',
      location: 'Munich',
      status: 'Interview Scheduled',
      stage: 'Technical Interview',
      appliedDate: '2024-01-12',
      experience: '4 years',
      avatar: 'ER',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCandidates(mockCandidates);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Needs Review': return 'bg-yellow-100 text-yellow-700';
      case 'Ready for Interview': return 'bg-blue-100 text-blue-700';
      case 'Interview Scheduled': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recruitment</h1>
          <p className="text-gray-600 mt-1">Review candidates and schedule interviews</p>
        </div>
        <button className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Request New Hire
        </button>
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Candidate Review Queue</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading candidates...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Candidate</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Position</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Experience</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stage</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {candidate.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{candidate.name}</p>
                          <p className="text-xs text-gray-500">{candidate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">{candidate.position}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {candidate.location}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">{candidate.experience}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">{candidate.stage}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-primary hover:bg-primary-dark text-white text-sm rounded-lg transition-colors">
                          Review
                        </button>
                        <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Calendar className="w-4 h-4" />
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
  );
};

export default Recruitment;