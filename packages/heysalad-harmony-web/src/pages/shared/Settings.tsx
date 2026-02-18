import { useState } from 'react';
import { User, Bell, Shield, Globe, Moon, Mail, Lock, Smartphone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../App';

const Settings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '+49 30 12345678',
    department: 'Operations',
    location: 'Berlin Hub',
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'Europe/Berlin',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    taskReminders: true,
    teamUpdates: true,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginAlerts: true,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = () => {
    console.log('Saving settings...');
    // Add save logic here
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-50 border border-gray-200 p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#00bcd4] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-gray-50 border border-gray-200 p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-24 h-24 bg-[#00bcd4] flex items-center justify-center">
                        <span className="text-white font-bold text-4xl">
                          {currentUser?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <button className="px-4 py-2 bg-[#00bcd4] hover:bg-[#00a6b8] text-white font-medium transition-colors mb-2">
                          Change Photo
                        </button>
                        <p className="text-sm text-gray-500">JPG, PNG or GIF (max. 2MB)</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#00bcd4] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#00bcd4] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#00bcd4] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                      <select
                        value={profileData.department}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#00bcd4] focus:outline-none"
                      >
                        <option value="Operations">Operations</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Logistics">Logistics</option>
                        <option value="HR">HR</option>
                        <option value="Administration">Administration</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                      <select
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#00bcd4] focus:outline-none"
                      >
                        <option value="Berlin Hub">Berlin Hub</option>
                        <option value="Munich Center">Munich Center</option>
                        <option value="Hamburg Port">Hamburg Port</option>
                        <option value="Frankfurt">Frankfurt</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Preferences</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#00bcd4] focus:outline-none"
                      >
                        <option value="en">English</option>
                        <option value="de">Deutsch (German)</option>
                        <option value="es">Español (Spanish)</option>
                        <option value="fr">Français (French)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
                      <select
                        value={preferences.timezone}
                        onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#00bcd4] focus:outline-none"
                      >
                        <option value="Europe/Berlin">Berlin (GMT+1)</option>
                        <option value="Europe/London">London (GMT+0)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                        <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date Format</label>
                      <select
                        value={preferences.dateFormat}
                        onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#00bcd4] focus:outline-none"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Theme</label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                          className={`flex items-center gap-2 px-4 py-3 border-2 transition-all ${
                            preferences.theme === 'light'
                              ? 'border-[#00bcd4] bg-[#00bcd4]/10'
                              : 'border-gray-300'
                          }`}
                        >
                          <div className="w-6 h-6 bg-white border-2 border-gray-300" />
                          Light
                        </button>
                        <button
                          onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                          className={`flex items-center gap-2 px-4 py-3 border-2 transition-all ${
                            preferences.theme === 'dark'
                              ? 'border-[#00bcd4] bg-[#00bcd4]/10'
                              : 'border-gray-300'
                          }`}
                        >
                          <Moon className="w-6 h-6" />
                          Dark
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Settings</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive updates via email</p>
                        </div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={notifications.emailNotifications}
                          onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 peer-checked:bg-[#00bcd4] transition-all cursor-pointer"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white transition-all peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Push Notifications</p>
                          <p className="text-sm text-gray-600">Browser and app notifications</p>
                        </div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={notifications.pushNotifications}
                          onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 peer-checked:bg-[#00bcd4] transition-all cursor-pointer"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white transition-all peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">SMS Notifications</p>
                          <p className="text-sm text-gray-600">Text message alerts</p>
                        </div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={notifications.smsNotifications}
                          onChange={(e) => setNotifications({ ...notifications, smsNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 peer-checked:bg-[#00bcd4] transition-all cursor-pointer"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white transition-all peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Content Preferences</h3>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900">Weekly Reports</p>
                        <p className="text-sm text-gray-600">Summary of your activity</p>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={notifications.weeklyReports}
                          onChange={(e) => setNotifications({ ...notifications, weeklyReports: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 peer-checked:bg-[#00bcd4] transition-all cursor-pointer"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white transition-all peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900">Task Reminders</p>
                        <p className="text-sm text-gray-600">Upcoming deadlines and tasks</p>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={notifications.taskReminders}
                          onChange={(e) => setNotifications({ ...notifications, taskReminders: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 peer-checked:bg-[#00bcd4] transition-all cursor-pointer"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white transition-all peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900">Team Updates</p>
                        <p className="text-sm text-gray-600">News from your team</p>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={notifications.teamUpdates}
                          onChange={(e) => setNotifications({ ...notifications, teamUpdates: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 peer-checked:bg-[#00bcd4] transition-all cursor-pointer"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white transition-all peer-checked:translate-x-6"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-white border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Change Password</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className="w-full px-4 py-3 pr-12 border-2 border-gray-300 focus:border-[#00bcd4] focus:outline-none"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#00bcd4] focus:outline-none"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#00bcd4] focus:outline-none"
                            placeholder="Confirm new password"
                          />
                        </div>
                        <button className="px-4 py-2 bg-[#00bcd4] hover:bg-[#00a6b8] text-white font-medium transition-colors">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600">Add an extra layer of security</p>
                        </div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={security.twoFactorAuth}
                          onChange={(e) => setSecurity({ ...security, twoFactorAuth: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 peer-checked:bg-[#00bcd4] transition-all cursor-pointer"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white transition-all peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="p-4 bg-white border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Session Timeout</label>
                      <select
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#00bcd4] focus:outline-none"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900">Login Alerts</p>
                        <p className="text-sm text-gray-600">Get notified of new logins</p>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={security.loginAlerts}
                          onChange={(e) => setSecurity({ ...security, loginAlerts: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 peer-checked:bg-[#00bcd4] transition-all cursor-pointer"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white transition-all peer-checked:translate-x-6"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-300">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Make sure to save your changes</p>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-[#00bcd4] hover:bg-[#00a6b8] text-white font-semibold transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;