import { Monitor, HardDrive, AlertCircle, CheckCircle } from 'lucide-react';

const IT = () => {
  const itStats = [
    { label: 'Active Devices', value: '312', icon: Monitor, color: 'bg-blue-500' },
    { label: 'Tickets Open', value: '8', icon: AlertCircle, color: 'bg-yellow-500' },
    { label: 'System Uptime', value: '99.8%', icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Storage Used', value: '2.4 TB', icon: HardDrive, color: 'bg-purple-500' },
  ];

  const devices = [
    { employee: 'Max Schmidt', device: 'MacBook Pro 16"', serial: 'MBP-2024-001', status: 'active', assignedDate: 'Jan 2023' },
    { employee: 'Anna Müller', device: 'Dell Latitude 5420', serial: 'DL-2024-045', status: 'active', assignedDate: 'Mar 2023' },
    { employee: 'Thomas Weber', device: 'iPad Air', serial: 'IPD-2024-089', status: 'active', assignedDate: 'Jun 2023' },
    { employee: 'Laura Fischer', device: 'ThinkPad X1 Carbon', serial: 'TP-2024-123', status: 'maintenance', assignedDate: 'Feb 2023' },
  ];

  const tickets = [
    { id: 'IT-2024-156', title: 'Password Reset Request', employee: 'Sarah Connor', priority: 'low', status: 'open', created: '2 hours ago' },
    { id: 'IT-2024-155', title: 'Laptop Not Connecting to WiFi', employee: 'John Smith', priority: 'high', status: 'in-progress', created: '5 hours ago' },
{ id: 'IT-2024-154', title: 'Software License Request', employee: 'Michael Becker', priority: 'medium', status: 'pending', created: '1 day ago' },
  ];

  const softwareLicenses = [
    { software: 'Microsoft 365', licenses: 247, used: 235, available: 12, cost: '€12/user/month' },
    { software: 'Adobe Creative Cloud', licenses: 15, used: 12, available: 3, cost: '€54/user/month' },
    { software: 'Slack Business', licenses: 247, used: 247, available: 0, cost: '€8/user/month' },
    { software: 'Zoom Pro', licenses: 50, used: 42, available: 8, cost: '€15/user/month' },
  ];

  const systemStatus = [
    { system: 'Email Server', status: 'operational', uptime: '99.9%' },
    { system: 'HR Database', status: 'operational', uptime: '99.8%' },
    { system: 'File Storage', status: 'operational', uptime: '100%' },
    { system: 'VPN', status: 'maintenance', uptime: '98.5%' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">IT Management</h1>
            <p className="text-gray-600 mt-1">Manage devices, software, and IT support</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
            <Monitor className="w-4 h-4" />
            Assign Device
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {itStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Devices</h3>
            <div className="space-y-3">
              {devices.map((device, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{device.employee}</h4>
                      <p className="text-sm text-gray-600 mt-1">{device.device}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      device.status === 'active' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {device.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
                    <span>Serial: {device.serial}</span>
                    <span>Assigned: {device.assignedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Tickets</h3>
            <div className="space-y-3">
              {tickets.map((ticket, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{ticket.id}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900">{ticket.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{ticket.employee} • {ticket.created}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'open' ? 'bg-yellow-100 text-yellow-700' :
                      ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Software Licenses</h3>
            <div className="space-y-4">
              {softwareLicenses.map((license, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{license.software}</h4>
                    <span className="text-sm font-medium text-gray-900">{license.cost}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Licenses:</span>
                      <span className="font-medium text-gray-900">{license.licenses}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Used:</span>
                      <span className="font-medium text-gray-900">{license.used}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Available:</span>
                      <span className={`font-medium ${license.available === 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {license.available}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(license.used / license.licenses) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              {systemStatus.map((system, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {system.status === 'operational' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      )}
                      <h4 className="font-semibold text-gray-900">{system.system}</h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      system.status === 'operational' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {system.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Uptime:</span>
                    <span className="font-medium text-gray-900">{system.uptime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IT;