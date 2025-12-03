import { useState, useCallback, useEffect } from 'react';

// Basic preferences hook placeholder
export const usePreferences = () => {
  const [preferences, setPreferences] = useState<Record<string, any>>({});

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('user_preferences');
    if (stored) {
      try {
        setPreferences(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage
  const updatePreference = useCallback((key: string, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem('user_preferences', JSON.stringify(newPreferences));
  }, [preferences]);

  // Get a specific preference
  const getPreference = useCallback((key: string, defaultValue?: any) => {
    return preferences[key] ?? defaultValue;
  }, [preferences]);

  // Reset all preferences
  const resetPreferences = useCallback(() => {
    setPreferences({});
    localStorage.removeItem('user_preferences');
  }, []);

  return {
    preferences,
    updatePreference,
    getPreference,
    resetPreferences,
    // Common preference getters
    theme: getPreference('theme', 'light'),
    language: getPreference('language', 'en'),
    notifications: getPreference('notifications', true),
  };
};

export default usePreferences;