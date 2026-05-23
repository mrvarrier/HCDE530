import React from 'react';
import { ExternalLink, Calendar, Globe, AlertTriangle, AlertCircle } from 'lucide-react';
import { Card } from '../UI';

export const AuditHeader = ({ audit }) => {
  const { url, timestamp, dataSource, scrapeWarnings, scrapeStatus } = audit;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDataSourceLabel = () => {
    if (dataSource === 'real') return 'Real Web Scraping';
    if (dataSource === 'hybrid') return 'Hybrid (PageSpeed + Simulation)';
    return 'Simulated Data';
  };

  const getDataSourceColor = () => {
    if (dataSource === 'real') return 'bg-green-100 text-green-800';
    if (dataSource === 'hybrid') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Card hover={false} className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <Globe className="w-6 h-6 text-gray-600" />
              <h1 className="text-3xl font-bold text-gray-900 break-all">{url}</h1>
              <a
                href={url.startsWith('http') ? url : `https://${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 flex-shrink-0"
                title="Open in new tab"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(timestamp)}</span>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDataSourceColor()}`}>
                  {getDataSourceLabel()}
                </span>
              </div>
              {scrapeStatus && scrapeStatus !== 'success' && (
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    scrapeStatus === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {scrapeStatus === 'blocked' ? 'Scraping Blocked' : 'Partial Load'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Scrape Warnings */}
      {scrapeWarnings && scrapeWarnings.length > 0 && (
        <div className="mb-8 space-y-3">
          {scrapeWarnings.map((warning, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 p-4 rounded-lg ${
                warning.type === 'error'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              {warning.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  warning.type === 'error' ? 'text-red-900' : 'text-yellow-900'
                }`}>
                  {warning.message}
                </h4>
                <p className={`text-sm mt-1 ${
                  warning.type === 'error' ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  {warning.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
