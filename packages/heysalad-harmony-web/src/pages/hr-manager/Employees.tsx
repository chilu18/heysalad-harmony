import { Users, Plus, Search, Filter, Mail, Phone, MapPin } from 'lucide-react';

const Employees = () => {
  const employeeStats = [
    { label: 'Total Employees', value: '247', change: '+12 this month', icon: Users, color: 'bg-blue-500' },
    { label: 'Active', value: '235', change: '95% active', icon: Users, color: 'bg-green-500' },
    { label: 'On Leave', value: '8', change: '3%', icon: Users, color: 'bg-yellow-500' },
    { label: 'New Hires (30d)', value: '12', change: '+5%', icon: Users, color: 'bg-purple-500' },
  ];

  const employees = [
    { name: 'Max Schmidt', role: 'Warehouse Lead', department: 'Operations', location: 'Berlin Hub', email: 'max.schmidt@bereit.works', phone: '+49 30 12345678', status: 'active', joinDate: 'Jan 2023' },
    { name: 'Anna Müller', role: 'Operations Supervisor', department: 'Operations', location: 'Berlin Hub', email: 'anna.mueller@bereit.works', phone: '+49 30 23456789', status: 'active', joinDate: 'Mar 2023' },
    { name: 'Thomas Weber', role: 'Forklift Operator', department: 'Warehouse', location: 'Munich Center', email: 'thomas.weber@bereit.works', phone: '+49 89 34567890', status: 'active', joinDate: 'Jun 2023' },
    { name: 'Laura Fischer', role: 'Logistics Coordinator', department: 'Logistics', location: 'Hamburg Port', email: 'laura.fischer@bereit.works', phone: '+49 40 45678901', status: 'on-leave', joinDate: 'Feb 2023' },
    { name: 'Michael Becker', role: 'Warehouse Staff', department: 'Warehouse', location: 'Berlin Hub', email: 'michael.becker@bereit.works', phone: '+49 30 56789012', status: 'active', joinDate: 'Aug 2023' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            <p className="text-gray-600 mt-1">Manage your workforce</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {employeeStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium mt-1">{stat.change}</p>
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
            <h3 className="text-lg font-semibold text-gray-900">All Employees</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {employees.map((employee, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">{employee.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          employee.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {employee.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{employee.role} • {employee.department}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{employee.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{employee.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>Joined {employee.joinDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="text-sm text-primary hover:text-primary-dark font-medium">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;