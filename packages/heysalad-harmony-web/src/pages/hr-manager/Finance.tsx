import { DollarSign, TrendingUp, TrendingDown, Users, Calendar, PieChart } from 'lucide-react';
import {  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Finance = () => {
  const financeStats = [
    { label: 'Total Payroll', value: '€198K', change: '+3% from last month', icon: DollarSign, color: 'bg-green-500', trend: 'up' },
    { label: 'Benefits Cost', value: '€42K', change: '+2% from last month', icon: TrendingUp, color: 'bg-blue-500', trend: 'up' },
    { label: 'Recruitment Cost', value: '€15K', change: '-12% from last month', icon: Users, color: 'bg-purple-500', trend: 'down' },
    { label: 'Training Budget', value: '€8.5K', change: '45% utilized', icon: PieChart, color: 'bg-yellow-500', trend: 'neutral' },
  ];

  const monthlyPayroll = [
    { month: 'Jan', payroll: 185, benefits: 38, recruitment: 22 },
    { month: 'Feb', payroll: 188, benefits: 39, recruitment: 18 },
    { month: 'Mar', payroll: 192, benefits: 40, recruitment: 25 },
    { month: 'Apr', payroll: 190, benefits: 41, recruitment: 20 },
    { month: 'May', payroll: 195, benefits: 41, recruitment: 15 },
    { month: 'Jun', payroll: 198, benefits: 42, recruitment: 15 },
  ];

  const departmentCosts = [
    { department: 'Operations', employees: 85, monthlyCost: '€89,500', avgSalary: '€3,200' },
    { department: 'Warehouse', employees: 120, monthlyCost: '€78,000', avgSalary: '€2,800' },
    { department: 'Logistics', employees: 32, monthlyCost: '€24,800', avgSalary: '€3,100' },
    { department: 'Administration', employees: 10, monthlyCost: '€5,700', avgSalary: '€4,200' },
  ];

  const upcomingPayments = [
    { description: 'Monthly Payroll - November', amount: '€198,000', date: 'Nov 30, 2024', type: 'payroll' },
    { description: 'Health Insurance Premium', amount: '€28,500', date: 'Nov 5, 2024', type: 'benefits' },
    { description: 'Pension Contributions', amount: '€13,500', date: 'Nov 10, 2024', type: 'benefits' },
    { description: 'Training Program Payment', amount: '€4,200', date: 'Nov 15, 2024', type: 'training' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finance</h1>
            <p className="text-gray-600 mt-1">HR budget and payroll management</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <Calendar className="w-4 h-4" />
              This Month
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
              Download Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financeStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600" />}
                {stat.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-600" />}
              </div>
              <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-sm text-gray-600 font-medium mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Costs Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPayroll}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="payroll" stroke="#10b981" strokeWidth={2} name="Payroll (€K)" />
                <Line type="monotone" dataKey="benefits" stroke="#3b82f6" strokeWidth={2} name="Benefits (€K)" />
                <Line type="monotone" dataKey="recruitment" stroke="#8b5cf6" strokeWidth={2} name="Recruitment (€K)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Costs</h3>
            <div className="space-y-3">
              {departmentCosts.map((dept, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{dept.department}</h4>
                    <span className="text-sm font-semibold text-gray-900">{dept.monthlyCost}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{dept.employees} employees</span>
                    <span>Avg: {dept.avgSalary}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Payments</h3>
          <div className="space-y-3">
            {upcomingPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{payment.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{payment.amount}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    payment.type === 'payroll' ? 'bg-green-100 text-green-700' :
                    payment.type === 'benefits' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {payment.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;