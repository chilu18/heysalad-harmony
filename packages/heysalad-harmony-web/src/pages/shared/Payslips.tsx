import { Download, Eye, Calendar } from 'lucide-react';

const Payslips = () => {
  const payslips = [
    { month: 'October 2024', gross: '3,500', net: '2,450', date: '31 Oct 2024', status: 'paid' },
    { month: 'September 2024', gross: '3,500', net: '2,450', date: '30 Sep 2024', status: 'paid' },
    { month: 'August 2024', gross: '3,500', net: '2,450', date: '31 Aug 2024', status: 'paid' },
    { month: 'July 2024', gross: '3,500', net: '2,450', date: '31 Jul 2024', status: 'paid' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payslips</h1>
        <p className="text-gray-600 mt-1">View and download your salary statements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-600 font-medium">Current Month (Oct)</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">€2,450</p>
          <p className="text-sm text-green-600 font-medium mt-1">Net Salary</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-600 font-medium">Gross Salary</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">€3,500</p>
          <p className="text-sm text-gray-600 font-medium mt-1">Before deductions</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-600 font-medium">YTD Earnings</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">€24,500</p>
          <p className="text-sm text-gray-600 font-medium mt-1">January - October</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Period</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Gross</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Net</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map((slip, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{slip.month}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">€{slip.gross}</td>
                  <td className="py-4 px-4 font-medium text-gray-900">€{slip.net}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{slip.date}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {slip.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payslips;