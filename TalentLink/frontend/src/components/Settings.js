import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useAuth } from '../contexts/AuthContext';
import { Cog6ToothIcon, MoonIcon, SunIcon, BellIcon, UserIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { changePassword } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('UTC');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // No need to load dark mode preference or handle toggle here anymore
  // as it's now handled by the DarkModeContext

  // Handle email notifications toggle
  const handleEmailNotificationsToggle = () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    localStorage.setItem('emailNotifications', newValue.toString());
  };

  // Handle push notifications toggle
  const handlePushNotificationsToggle = () => {
    const newValue = !pushNotifications;
    setPushNotifications(newValue);
    localStorage.setItem('pushNotifications', newValue.toString());
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Handle timezone change
  const handleTimezoneChange = (e) => {
    const newTimezone = e.target.value;
    setTimezone(newTimezone);
    localStorage.setItem('timezone', newTimezone);
  };

  // Handle change password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error/success messages when user starts typing
    if (passwordError) setPasswordError('');
    if (passwordSuccess) setPasswordSuccess('');
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle change password form submission
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);

    try {
      console.log('Attempting password change with data:', {
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      });
      
      // Try different field name formats that are commonly used
      const passwordData = {
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      };
      
      console.log('Sending password change request to /auth/change-password/');
      await changePassword(passwordData);
      
      setPasswordSuccess('Password changed successfully!');
      // Clear form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Hide form after 2 seconds
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess('');
      }, 2000);
      
    } catch (error) {
      console.error('Password change error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
      
      let errorMessage = 'Failed to change password. ';
      
      if (error.response?.status === 400) {
        errorMessage += error.response.data?.message || 'Please check your current password and try again.';
      } else if (error.response?.status === 401) {
        errorMessage += 'Authentication failed. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage += 'Access denied. You may not have permission to change this password.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else {
        errorMessage += 'Please check your current password and try again.';
      }
      
      setPasswordError(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Load saved preferences on component mount
  useEffect(() => {
    const savedEmailNotifications = localStorage.getItem('emailNotifications');
    const savedPushNotifications = localStorage.getItem('pushNotifications');
    const savedLanguage = localStorage.getItem('language');
    const savedTimezone = localStorage.getItem('timezone');

    if (savedEmailNotifications !== null) {
      setEmailNotifications(savedEmailNotifications === 'true');
    }
    if (savedPushNotifications !== null) {
      setPushNotifications(savedPushNotifications === 'true');
    }
    if (savedLanguage !== null) {
      setLanguage(savedLanguage);
    }
    if (savedTimezone !== null) {
      setTimezone(savedTimezone);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account preferences and application settings</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Appearance Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Cog6ToothIcon className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {darkMode ? (
                    <MoonIcon className="h-5 w-5 text-gray-400 mr-3" />
                  ) : (
                    <SunIcon className="h-5 w-5 text-gray-400 mr-3" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    darkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <BellIcon className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <button
                  onClick={handleEmailNotificationsToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                </div>
                <button
                  onClick={handlePushNotificationsToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <UserIcon className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Account</h2>
            </div>
            
            <div className="space-y-4">
              {/* Language */}
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-900 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>

              {/* Timezone */}
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-900 mb-2">
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={timezone}
                  onChange={handleTimezoneChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time (EST)</option>
                  <option value="CST">Central Time (CST)</option>
                  <option value="MST">Mountain Time (MST)</option>
                  <option value="PST">Pacific Time (PST)</option>
                  <option value="GMT">Greenwich Mean Time (GMT)</option>
                  <option value="CET">Central European Time (CET)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Change Password</span>
                <span className="text-sm text-gray-500">{showChangePassword ? '↓' : '→'}</span>
              </button>

              {/* Change Password Form */}
              {showChangePassword && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.currentPassword ? 'text' : 'password'}
                          name="currentPassword"
                          id="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('currentPassword')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword.currentPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.newPassword ? 'text' : 'password'}
                          name="newPassword"
                          id="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your new password (min. 8 characters)"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('newPassword')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword.newPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.confirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          id="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Confirm your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirmPassword')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword.confirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Error/Success Messages */}
                    {passwordError && (
                      <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
                        {passwordError}
                      </div>
                    )}
                    
                    {passwordSuccess && (
                      <div className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-md p-3">
                        {passwordSuccess}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isChangingPassword ? 'Changing...' : 'Change Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowChangePassword(false);
                          setPasswordError('');
                          setPasswordSuccess('');
                          setPasswordForm({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-900">Two-Factor Authentication</span>
                <span className="text-sm text-gray-500">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-900">Privacy Settings</span>
                <span className="text-sm text-gray-500">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;