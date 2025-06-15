
'use client';

import { useState, useEffect } from 'react';
import { 
  CustomButton, 
  LoadingSpinner,
  useWindowSize, 
  useLocalStorage 
} from 'support.js/react';
import { dateUtils, stringUtils, numberUtils } from 'support.js/utils';

export default function NextJsExample() {
  const { width, height } = useWindowSize();
  const [preferences, setPreferences] = useLocalStorage('userPrefs', {
    theme: 'light',
    language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAction = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };

  if (!mounted) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Support.js Next.js Integration</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">React Hooks</h2>
          <p>Window Size: {width} x {height}</p>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Theme:</label>
            <select 
              value={preferences.theme}
              onChange={(e) => setPreferences({
                ...preferences, 
                theme: e.target.value
              })}
              className="border rounded px-3 py-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div className="card bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Custom Components</h2>
          <div className="space-y-3">
            <CustomButton 
              variant="primary" 
              onClick={handleAction}
              loading={loading}
            >
              Primary Action
            </CustomButton>
            <CustomButton variant="secondary" size="small">
              Secondary
            </CustomButton>
            <CustomButton variant="danger" disabled>
              Disabled
            </CustomButton>
          </div>
        </div>

        <div className="card bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Date Utilities</h2>
          <ul className="space-y-2">
            <li>Today: {dateUtils.formatDate(new Date(), 'YYYY-MM-DD')}</li>
            <li>
              Yesterday: {dateUtils.getRelativeTime(
                new Date(Date.now() - 24 * 60 * 60 * 1000)
              )}
            </li>
          </ul>
        </div>

        <div className="card bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">String & Number Utils</h2>
          <ul className="space-y-2">
            <li>
              CamelCase: {stringUtils.toCamelCase('next-js-example')}
            </li>
            <li>
              Currency: {numberUtils.formatCurrency(1234.56, 'USD')}
            </li>
            <li>
              Random: {numberUtils.randomInRange(1, 100)}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
