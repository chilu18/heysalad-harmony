import { ShoppingCart, Package, TrendingUp, AlertCircle, Plus, Search } from 'lucide-react';

const Procurement = () => {
  const procurementStats = [
    { label: 'Active Orders', value: '23', change: '+5 this week', icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Pending Approval', value: '8', change: '3 urgent', icon: AlertCircle, color: 'bg-yellow-500' },
    { label: 'Monthly Spend', value: '€45.2K', change: '-8% from last month', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Items in Stock', value: '1,247', change: '92% capacity', icon: Package, color: 'bg-purple-500' },
  ];

  const orders = [
    {
      id: 'PO-2024-0156',
      item: 'Forklift Parts & Maintenance',
      supplier: 'Industrial Equipment GmbH',
      quantity: '15 units',
      amount: '€2,450',
      status: 'pending',
      priority: 'high',
      date: 'Nov 1, 2024',
    },
    {
      id: 'PO-2024-0155',
      item: 'Safety Equipment & PPE',
      supplier: 'WorkSafe Solutions',
      quantity: '200 units',
      amount: '€1,850',
      status: 'approved',
      priority: 'normal',
      date: 'Oct 30, 2024',
    },
    {
      id: 'PO-2024-0154',
      item: 'Warehouse Shelving Units',
      supplier: 'Storage Systems AG',
      quantity: '20 units',
      amount: '€8,900',
      status: 'in-transit',
      priority: 'normal',
      date: 'Oct 28, 2024',
    },
    {
      id: 'PO-2024-0153',
      item: 'Office Supplies',
      supplier: 'Office Direct',
      quantity: 'Various',
      amount: '€340',
      status: 'delivered',
      priority: 'low',
      date: 'Oct 25, 2024',
    },
  ];

  const topSuppliers = [
    { name: 'Industrial Equipment GmbH', orders: 45, spent: '€125,000' },
    { name: 'WorkSafe Solutions', orders: 38, spent: '€89,000' },
    { name: 'Storage Systems AG', orders: 22, spent: '€156,000' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Procurement</h1>
            <p className="text-gray-600 mt-1">Manage orders and suppliers</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
            <Plus className="w-4 h-4" />
            New Purchase Order
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {procurementStats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="space-y-3">
              {orders.map((order, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{order.id}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.priority === 'high' ? 'bg-red-100 text-red-700' :
                          order.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium">{order.item}</p>
                      <p className="text-sm text-gray-600 mt-1">{order.supplier}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'in-transit' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{order.quantity}</span>
                      <span>•</span>
                      <span className="font-medium text-gray-900">{order.amount}</span>
                      <span>•</span>
                      <span>{order.date}</span>
                    </div>
                    <button className="text-sm text-primary hover:text-primary-dark font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Suppliers</h3>
            <div className="space-y-4">
              {topSuppliers.map((supplier, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3">{supplier.name}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Orders:</span>
                      <span className="font-medium text-gray-900">{supplier.orders}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="font-medium text-gray-900">{supplier.spent}</span>
                    </div>
                  </div>
                  <button className="w-full mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Procurement;