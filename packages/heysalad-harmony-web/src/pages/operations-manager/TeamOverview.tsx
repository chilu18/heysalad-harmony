import { Users, TrendingUp, Clock, Award, Search, Filter } from 'lucide-react';

const TeamOverview = () => {
  const teamStats = [
    { label: 'Total Team Members', value: '156', change: '+8 this month', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Today', value: '142', change: '91% attendance', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Avg Hours/Week', value: '38.5', change: '+2.5 from last week', icon: Clock, color: 'bg-purple-500' },
    { label: 'Top Performers', value: '24', change: '15% of team', icon: Award, color: 'bg-yellow-500' },
  ];

  const teamMembers = [
    { name: 'Max Schmidt', role: 'Warehouse Lead', location: 'Berlin Hub', hours: 42, performance: 98, status: 'active' },
    { name: 'Anna Müller', role: 'Operations Supervisor', location: 'Berlin Hub', hours: 40, performance: 95, status: 'active' },
    { name: 'Thomas Weber', role: 'Forklift Operator', location: 'Munich Center', hours: 38, performance: 92, status: 'active' },
    { name: 'Laura Fischer', role: 'Logistics Coordinator', location: 'Hamburg Port', hours: 41, performance: 96, status: 'active' },
    { name: 'Michael Becker', role: 'Warehouse Staff', location: 'Berlin Hub', hours: 37, performance: 88, status: 'active' },
    { name: 'Sarah Wagner', role: 'Inventory Manager', location: 'Frankfurt', hours: 40, performance: 94, status: 'active' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Overview</h1>
            <p className="text-gray-600 mt-1">Monitor your team's performance and attendance</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
            <Users className="w-4 h-4" />
            Add Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all">
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

        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search team..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Hours (Week)</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Performance</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-white transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{member.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-gray-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{member.role}</td>
                    <td className="py-4 px-4 text-gray-600">{member.location}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">{member.hours}h</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${member.performance}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{member.performance}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {member.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-sm text-primary hover:text-primary-dark font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamOverview;