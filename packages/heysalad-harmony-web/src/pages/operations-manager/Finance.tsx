import { DollarSign, TrendingUp, TrendingDown, CreditCard, Calendar } from 'lucide-react';
import {  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Finance = () => {
  const financeStats = [
    { label: 'Monthly Revenue', value: '€245K', change: '+12% from last month', icon: DollarSign, color: 'bg-green-500', trend: 'up' },
    { label: 'Monthly Expenses', value: '€178K', change: '-5% from last month', icon: CreditCard, color: 'bg-red-500', trend: 'down' },
    { label: 'Net Profit', value: '€67K', change: '+28% from last month', icon: TrendingUp, color: 'bg-blue-500', trend: 'up' },
    { label: 'Profit Margin', value: '27.3%', change: '+3.2% from last month', icon: TrendingUp, color: 'bg-purple-500', trend: 'up' },
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 210, expenses: 165, profit: 45 },
    { month: 'Feb', revenue: 220, expenses: 170, profit: 50 },
    { month: 'Mar', revenue: 235, expenses: 175, profit: 60 },
    { month: 'Apr', revenue: 225, expenses: 180, profit: 45 },
    { month: 'May', revenue: 240, expenses: 185, profit: 55 },
    { month: 'Jun', revenue: 245, expenses: 178, profit: 67 },
  ];

  const expenseBreakdown = [
    { category: 'Salaries & Wages', amount: '€98,500', percentage: 55 },
    { category: 'Equipment & Supplies', amount: '€32,400', percentage: 18 },
    { category: 'Facilities & Utilities', amount: '€24,700', percentage: 14 },
    { category: 'Transportation', amount: '€15,800', percentage: 9 },
    { category: 'Other', amount: '€6,600', percentage: 4 },
  ];

  const recentTransactions = [
    { description: 'Salary Payment - October', amount: '-€98,500', date: 'Oct 31, 2024', type: 'expense' },
    { description: 'Client Payment - ABC Logistics', amount: '+€45,000', date: 'Oct 30, 2024', type: 'income' },
    { description: 'Equipment Purchase', amount: '-€8,900', date: 'Oct 28, 2024', type: 'expense' },
    { description: 'Client Payment - XYZ Corp', amount: '+€32,000', date: 'Oct 27, 2024', type: 'income' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finance</h1>
            <p className="text-gray-600 mt-1">Financial overview and reporting</p>
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
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-sm text-gray-600 font-medium mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue (€K)" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses (€K)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
            <div className="space-y-4">
              {expenseBreakdown.map((expense, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{expense.category}</span>
                    <span className="text-sm font-semibold text-gray-900">{expense.amount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${expense.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{expense.percentage}% of total</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount}
                  </p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {transaction.type}
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