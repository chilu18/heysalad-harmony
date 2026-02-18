import { CheckCircle, Clock, XCircle, FileText, DollarSign, Calendar, User } from 'lucide-react';

const Approvals = () => {
  const approvalStats = [
    { label: 'Pending Approvals', value: '15', icon: Clock, color: 'bg-yellow-500' },
    { label: 'Approved Today', value: '12', icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Rejected', value: '3', icon: XCircle, color: 'bg-red-500' },
    { label: 'Total This Month', value: '198', icon: FileText, color: 'bg-blue-500' },
  ];

  const pendingApprovals = [
    {
      type: 'Job Offer',
      employee: 'Sarah Connor',
      department: 'Warehouse',
      details: 'Warehouse Staff - €2,800/month',
      date: 'Nov 1, 2024',
      priority: 'high',
      icon: FileText,
    },
    {
      type: 'Salary Increase',
      employee: 'Max Schmidt',
      department: 'Operations',
      details: '€500/month increase - Performance review',
      date: 'Nov 1, 2024',
      priority: 'normal',
      icon: DollarSign,
    },
    {
      type: 'Leave Request',
      employee: 'Anna Müller',
      department: 'Operations',
      details: 'Parental leave - 6 months',
      date: 'Dec 1, 2024',
      priority: 'urgent',
      icon: Calendar,
    },
    {
      type: 'Promotion',
      employee: 'Thomas Weber',
      department: 'Warehouse',
      details: 'Warehouse Lead - +€600/month',
      date: 'Nov 15, 2024',
      priority: 'normal',
      icon: User,
    },
  ];

  const recentActivity = [
    { type: 'Approved', request: 'Job Offer - Laura Fischer', time: '1 hour ago', status: 'approved' },
    { type: 'Approved', request: 'Salary Review - Michael Becker', time: '3 hours ago', status: 'approved' },
    { type: 'Rejected', request: 'Leave Extension - John Doe', time: '5 hours ago', status: 'rejected' },
  ];

  const handleApprove = (employee: string) => {
    console.log('Approved:', employee);
  };

  const handleReject = (employee: string) => {
    console.log('Rejected:', employee);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approvals</h1>
          <p className="text-gray-600 mt-1">Review and approve HR requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approvalStats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
            <div className="space-y-3">
              {pendingApprovals.map((approval, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        approval.priority === 'urgent' ? 'bg-red-100' :
                        approval.priority === 'high' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        <approval.icon className={`w-5 h-5 ${
                          approval.priority === 'urgent' ? 'text-red-600' :
                          approval.priority === 'high' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{approval.type}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            approval.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                            approval.priority === 'high' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {approval.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{approval.details}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{approval.employee}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{approval.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleApprove(approval.employee)}
                      className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(approval.employee)}
                      className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Reject
                    </button>
                    <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    {activity.status === 'approved' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900">{activity.type}</span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.request}</p>
                  <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Approvals;