import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const {
    settings,
    isLoading,
    error,
    hasChanges,
    updateSettings,
    resetSettings,
    saveSettings,
    loadSettings,
    clearError
  } = useSettingsStore();

  const [activeSection, setActiveSection] = useState<string>('profile');

  // Load settings when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user, loadSettings]);

  // Clear error when active section changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [activeSection, error, clearError]);

  const settingsSections = [
    { id: 'profile', label: 'Profile Information', icon: '👤' },
    { id: 'learning', label: 'Learning Preferences', icon: '🧠' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'display', label: 'Display & Appearance', icon: '🎨' },
    { id: 'goals', label: 'Goals & Motivation', icon: '🎯' },
    { id: 'agent', label: 'AI Agent Settings', icon: '🤖' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card variant="glass" padding="lg">
          <div className="text-center py-8">
            <p className="text-white/70">Please log in to access settings.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        {hasChanges && (
          <Badge variant="warning" glass>
            Unsaved Changes
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card variant="glass" padding="md">
            <nav className="space-y-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {/* Loading indicator */}
          {isLoading && (
            <Card variant="glass" padding="lg" className="mb-6">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3 text-white">Loading your settings...</span>
              </div>
            </Card>
          )}

          {!isLoading && (
            <form onSubmit={handleSubmit}>
              <Card variant="glass" padding="lg">
                {/* Profile Information Section */}
                {activeSection === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                      <span>👤</span>
                      <span>Profile Information</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={settings.first_name}
                        onChange={(e) => updateSettings({ first_name: e.target.value })}
                        placeholder="Enter your first name"
                        glass
                      />
                      <Input
                        label="Last Name"
                        value={settings.last_name}
                        onChange={(e) => updateSettings({ last_name: e.target.value })}
                        placeholder="Enter your last name"
                        glass
                      />
                    </div>
                    
                    <Input
                      label="Email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSettings({ email: e.target.value })}
                      placeholder="Enter your email"
                      glass
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Bio
                      </label>
                      <textarea
                        value={settings.bio}
                        onChange={(e) => updateSettings({ bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="glass rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent w-full resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Learning Preferences Section */}
                {activeSection === 'learning' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                      <span>🧠</span>
                      <span>Learning Preferences</span>
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-3">
                        Learning Style
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['visual', 'auditory', 'kinesthetic', 'reading'] as const).map((style) => (
                          <button
                            key={style}
                            type="button"
                            onClick={() => updateSettings({ learning_style: style })}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                              settings.learning_style === style
                                ? 'border-blue-400 bg-blue-500/20 text-white'
                                : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                            }`}
                          >
                            <div className="text-lg mb-1">
                              {style === 'visual' && '👁️'}
                              {style === 'auditory' && '👂'}
                              {style === 'kinesthetic' && '✋'}
                              {style === 'reading' && '📖'}
                            </div>
                            <div className="text-sm font-medium capitalize">{style}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-3">
                          Preferred Difficulty
                        </label>
                        <div className="space-y-2">
                          {(['beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
                            <button
                              key={difficulty}
                              type="button"
                              onClick={() => updateSettings({ preferred_difficulty: difficulty })}
                              className={`w-full p-2 rounded-lg border text-left transition-all duration-200 ${
                                settings.preferred_difficulty === difficulty
                                  ? 'border-blue-400 bg-blue-500/20 text-white'
                                  : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                              }`}
                            >
                              <span className="font-medium capitalize">{difficulty}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-3">
                          Learning Pace
                        </label>
                        <div className="space-y-2">
                          {(['slow', 'moderate', 'fast'] as const).map((pace) => (
                            <button
                              key={pace}
                              type="button"
                              onClick={() => updateSettings({ learning_pace: pace })}
                              className={`w-full p-2 rounded-lg border text-left transition-all duration-200 ${
                                settings.learning_pace === pace
                                  ? 'border-blue-400 bg-blue-500/20 text-white'
                                  : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                              }`}
                            >
                              <span className="font-medium capitalize">{pace}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Notifications Section */}
                {activeSection === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                      <span>🔔</span>
                      <span>Notification Settings</span>
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-white/20">
                        <div>
                          <h3 className="font-medium text-white">Enable Notifications</h3>
                          <p className="text-sm text-white/70">Receive all types of notifications</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateSettings({ notifications_enabled: !settings.notifications_enabled })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications_enabled ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.notifications_enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-white/20">
                        <div>
                          <h3 className="font-medium text-white">Email Notifications</h3>
                          <p className="text-sm text-white/70">Receive notifications via email</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateSettings({ email_notifications: !settings.email_notifications })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.email_notifications ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.email_notifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-white/20">
                        <div>
                          <h3 className="font-medium text-white">Push Notifications</h3>
                          <p className="text-sm text-white/70">Receive push notifications in browser</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateSettings({ push_notifications: !settings.push_notifications })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.push_notifications ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.push_notifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Display & Appearance Section */}
                {activeSection === 'display' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                      <span>🎨</span>
                      <span>Display & Appearance</span>
                    </h2>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border border-white/20">
                      <div>
                        <h3 className="font-medium text-white">Dark Mode</h3>
                        <p className="text-sm text-white/70">Use dark theme throughout the application</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSettings({ dark_mode: !settings.dark_mode })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.dark_mode ? 'bg-blue-500' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.dark_mode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Goals Section */}
                {activeSection === 'goals' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                      <span>🎯</span>
                      <span>Goals & Motivation</span>
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Current Goal
                        </label>
                        <Input
                          value={settings.current_goal}
                          onChange={(e) => updateSettings({ current_goal: e.target.value })}
                          placeholder="What do you want to achieve?"
                          glass
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Goal Deadline
                        </label>
                        <Input
                          type="date"
                          value={settings.goal_deadline}
                          onChange={(e) => updateSettings({ goal_deadline: e.target.value })}
                          glass
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* AI Agent Settings Section */}
                {activeSection === 'agent' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                      <span>🤖</span>
                      <span>AI Agent Settings</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-3">
                          Interaction Level
                        </label>
                        <div className="space-y-2">
                          {(['minimal', 'moderate', 'high'] as const).map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => updateSettings({ agent_interaction_level: level })}
                              className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                                settings.agent_interaction_level === level
                                  ? 'border-blue-400 bg-blue-500/20 text-white'
                                  : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                              }`}
                            >
                              <span className="font-medium capitalize">{level}</span>
                              <p className="text-xs text-white/60 mt-1">
                                {level === 'minimal' && 'AI will provide minimal guidance'}
                                {level === 'moderate' && 'AI will provide balanced assistance'}
                                {level === 'high' && 'AI will be very interactive and helpful'}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-3">
                          Feedback Style
                        </label>
                        <div className="space-y-2">
                          {(['detailed', 'brief', 'encouraging'] as const).map((style) => (
                            <button
                              key={style}
                              type="button"
                              onClick={() => updateSettings({ preferred_feedback_style: style })}
                              className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                                settings.preferred_feedback_style === style
                                  ? 'border-blue-400 bg-blue-500/20 text-white'
                                  : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                              }`}
                            >
                              <span className="font-medium capitalize">{style}</span>
                              <p className="text-xs text-white/60 mt-1">
                                {style === 'detailed' && 'Receive comprehensive explanations'}
                                {style === 'brief' && 'Get concise, to-the-point feedback'}
                                {style === 'encouraging' && 'Receive supportive and motivational feedback'}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-white/20">
                  {error && (
                    <div className="flex-1 mr-4">
                      <p className="text-sm text-red-400">{error}</p>
                      <button
                        type="button"
                        onClick={clearError}
                        className="text-xs text-white/60 hover:text-white/80 mt-1"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={resetSettings}
                      disabled={isLoading || !hasChanges}
                    >
                      Reset Changes
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isLoading}
                      disabled={!hasChanges}
                    >
                      Save Settings
                    </Button>
                  </div>
                </div>
              </Card>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;