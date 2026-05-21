import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { Button } from '../UI';

export const AuditForm = ({ onSubmit, loading = false }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateURL = (urlString) => {
    try {
      // Add https:// if not present
      const fullURL = urlString.startsWith('http') ? urlString : `https://${urlString}`;
      new URL(fullURL);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    if (!validateURL(url)) {
      setError('Please enter a valid URL (e.g., example.com or https://example.com)');
      return;
    }

    onSubmit(url);
  };

  const exampleURLs = [
    'amazon.com',
    'airbnb.com',
    'notion.so',
    'stripe.com'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <div className="relative">
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com or https://example.com"
              disabled={loading}
              className={`
                w-full px-4 py-3 pl-12 pr-4 text-base border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                disabled:bg-gray-100 disabled:cursor-not-allowed
                ${error ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {error && (
            <div className="mt-2 flex items-center text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          fullWidth
          size="lg"
        >
          {loading ? 'Running Audit...' : 'Run UX Audit'}
        </Button>
      </form>

      <div className="mt-6">
        <p className="text-sm text-gray-500 text-center mb-3">Try these examples:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {exampleURLs.map((exampleURL) => (
            <button
              key={exampleURL}
              type="button"
              onClick={() => setUrl(exampleURL)}
              disabled={loading}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exampleURL}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
