import React, { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../UI';

export const SummarySection = ({ audit }) => {
  const { clientSummary } = audit;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(clientSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Client Report Summary</h2>
            <p className="text-gray-600">Professional summary ready for client presentation</p>
          </div>
        </div>
        <Button onClick={handleCopy} variant={copied ? 'secondary' : 'primary'}>
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Summary
            </>
          )}
        </Button>
      </div>

      <Card hover={false}>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {clientSummary}
            </pre>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">How to use this summary:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Copy and paste into your client presentation or proposal</li>
              <li>Customize with specific examples from your audit findings</li>
              <li>Add your professional recommendations and next steps</li>
              <li>Include in project kickoff documentation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
