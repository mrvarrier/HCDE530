import React, { useState, useEffect } from 'react';
import { MainLayout } from './components/Layout';
import { Landing } from './pages/Landing';
import { AuditProgress } from './components/Audit/AuditProgress';
import { AuditResults } from './pages/AuditResults';
import { runEnhancedAudit } from './utils/enhancedAuditEngine';

function App() {
  const [currentAudit, setCurrentAudit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [auditHistory, setAuditHistory] = useState([]);
  const [usePageSpeed, setUsePageSpeed] = useState(true); // Toggle for real performance data

  // Load audit history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('auditHistory');
    if (savedHistory) {
      try {
        setAuditHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Failed to load audit history:', err);
      }
    }

    // Load PageSpeed preference
    const savedPreference = localStorage.getItem('usePageSpeed');
    if (savedPreference !== null) {
      setUsePageSpeed(savedPreference === 'true');
    }
  }, []);

  // Save audit history to localStorage whenever it changes
  useEffect(() => {
    if (auditHistory.length > 0) {
      localStorage.setItem('auditHistory', JSON.stringify(auditHistory));
    }
  }, [auditHistory]);

  // Save PageSpeed preference
  useEffect(() => {
    localStorage.setItem('usePageSpeed', usePageSpeed.toString());
  }, [usePageSpeed]);

  const handleRunAudit = async (url) => {
    setLoading(true);
    setProgress(null);
    setCurrentAudit(null);

    try {
      const result = await runEnhancedAudit(url, setProgress, usePageSpeed);
      setCurrentAudit(result);

      // Add to history (keep last 10)
      setAuditHistory(prev => {
        const newHistory = [result, ...prev].slice(0, 10);
        return newHistory;
      });
    } catch (error) {
      console.error('Audit failed:', error);
      alert('Failed to run audit. Please try again.');
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const handleNewAudit = () => {
    setCurrentAudit(null);
    setProgress(null);
    setLoading(false);
  };

  return (
    <MainLayout
      onNewAudit={handleNewAudit}
      showNewAuditButton={!!currentAudit}
      usePageSpeed={usePageSpeed}
      onTogglePageSpeed={() => setUsePageSpeed(!usePageSpeed)}
    >
      {loading && <AuditProgress progress={progress} />}

      {!loading && !currentAudit && (
        <Landing
          onRunAudit={handleRunAudit}
          loading={loading}
          usePageSpeed={usePageSpeed}
          onTogglePageSpeed={() => setUsePageSpeed(!usePageSpeed)}
        />
      )}

      {!loading && currentAudit && (
        <AuditResults audit={currentAudit} />
      )}
    </MainLayout>
  );
}

export default App;
