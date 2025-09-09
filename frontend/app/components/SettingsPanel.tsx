"use client";

import { useState } from "react";

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    theme: "light",
    notifications: true,
    emailAlerts: true,
    language: "en",
    timezone: "UTC",
    autoSave: true,
    dataRetention: "30",
  });

  const tabs = [
    { id: "general", name: "General", icon: "⚙️" },
    { id: "notifications", name: "Notifications", icon: "🔔" },
    { id: "security", name: "Security", icon: "🔒" },
    { id: "data", name: "Data & Privacy", icon: "📊" },
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Simulate saving settings
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account and application preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-left ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  General Settings
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) =>
                        handleSettingChange("theme", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) =>
                        handleSettingChange("language", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) =>
                        handleSettingChange("timezone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="CET">Central European Time</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoSave"
                      checked={settings.autoSave}
                      onChange={(e) =>
                        handleSettingChange("autoSave", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="autoSave"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Enable auto-save
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Notification Preferences
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Push Notifications
                      </h4>
                      <p className="text-sm text-gray-500">
                        Receive notifications in your browser
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) =>
                        handleSettingChange("notifications", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Email Alerts
                      </h4>
                      <p className="text-sm text-gray-500">
                        Receive important updates via email
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailAlerts}
                      onChange={(e) =>
                        handleSettingChange("emailAlerts", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Notification Types
                    </h4>
                    <div className="space-y-3">
                      {[
                        "System updates",
                        "Security alerts",
                        "User activity",
                        "Performance reports",
                        "Marketing emails",
                      ].map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            id={type}
                            defaultChecked={type !== "Marketing emails"}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={type}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Security Settings
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Password
                    </h4>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Change Password
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Add an extra layer of security to your account
                    </p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                      Enable 2FA
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Active Sessions
                    </h4>
                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Current Session
                          </p>
                          <p className="text-sm text-gray-500">
                            Chrome on macOS • 192.168.1.100
                          </p>
                        </div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      API Keys
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Manage your API keys for programmatic access
                    </p>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
                      Manage API Keys
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Data & Privacy Settings */}
            {activeTab === "data" && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Data & Privacy
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Retention Period (days)
                    </label>
                    <select
                      value={settings.dataRetention}
                      onChange={(e) =>
                        handleSettingChange("dataRetention", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="365">1 year</option>
                      <option value="forever">Forever</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Data Export
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Download a copy of your data
                    </p>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
                      Export Data
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Account Deletion
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Permanently delete your account and all associated data
                    </p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">
                      Delete Account
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Privacy Controls
                    </h4>
                    <div className="space-y-3">
                      {[
                        "Allow analytics tracking",
                        "Share usage data for improvements",
                        "Enable crash reporting",
                        "Personalized recommendations",
                      ].map((control) => (
                        <div key={control} className="flex items-center">
                          <input
                            type="checkbox"
                            id={control}
                            defaultChecked={
                              control !== "Share usage data for improvements"
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={control}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {control}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex justify-end space-x-3">
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
