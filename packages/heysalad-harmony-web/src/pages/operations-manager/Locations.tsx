import { MapPin, Users, Package, TrendingUp, Phone, Mail } from 'lucide-react';

const Locations = () => {
  const locations = [
    {
      name: 'Berlin Hub',
      address: 'Hauptstraße 123, 10115 Berlin',
      manager: 'Max Schmidt',
      staff: 45,
      capacity: '85%',
      phone: '+49 30 12345678',
      email: 'berlin@bereit.works',
      status: 'active',
      productivity: 96,
    },
    {
      name: 'Munich Center',
      address: 'Bahnhofstraße 45, 80331 Munich',
      manager: 'Anna Müller',
      staff: 38,
      capacity: '78%',
      phone: '+49 89 87654321',
      email: 'munich@bereit.works',
      status: 'active',
      productivity: 94,
    },
    {
      name: 'Hamburg Port',
      address: 'Hafenstraße 78, 20457 Hamburg',
      manager: 'Thomas Weber',
      staff: 52,
      capacity: '92%',
      phone: '+49 40 23456789',
      email: 'hamburg@bereit.works',
      status: 'active',
      productivity: 91,
    },
    {
      name: 'Frankfurt',
      address: 'Zeil 56, 60313 Frankfurt',
      manager: 'Laura Fischer',
      staff: 21,
      capacity: '65%',
      phone: '+49 69 98765432',
      email: 'frankfurt@bereit.works',
      status: 'active',
      productivity: 89,
    },
  ];

  const totalStats = {
    locations: locations.length,
    totalStaff: locations.reduce((sum, loc) => sum + loc.staff, 0),
    avgCapacity: Math.round(locations.reduce((sum, loc) => sum + parseInt(loc.capacity), 0) / locations.length),
    avgProductivity: Math.round(locations.reduce((sum, loc) => sum + loc.productivity, 0) / locations.length),
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
            <p className="text-gray-600 mt-1">Manage warehouse and distribution centers</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
            <MapPin className="w-4 h-4" />
            Add Location
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Locations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.locations}</p>
                <p className="text-sm text-green-600 font-medium mt-1">All active</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Staff</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.totalStaff}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">Across all sites</p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg Capacity</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.avgCapacity}%</p>
                <p className="text-sm text-gray-600 font-medium mt-1">Utilization rate</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg Productivity</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.avgProductivity}%</p>
                <p className="text-sm text-green-600 font-medium mt-1">+2% from last month</p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {locations.map((location, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{location.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {location.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span>Staff</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{location.staff}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Package className="w-4 h-4" />
                    <span>Capacity</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{location.capacity}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Manager:</span>
                  <span className="font-medium text-gray-900">{location.manager}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Productivity:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${location.productivity}%` }}
                      />
                    </div>
                    <span className="font-medium text-gray-900">{location.productivity}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{location.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{location.email}</span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Locations;