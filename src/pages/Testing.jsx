// TESTING ROUTE - Enables testing mode and redirects to dashboard
// This route activates testing mode then sends you to the normal app
// All pages will show a testing banner when testing mode is active
// WARNING: Remove this route before production!

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestingMode } from '../context/TestingModeContext.jsx';

export default function Testing() {
  const { isTestingMode, isHydrated, enableTestingMode } = useTestingMode();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for hydration
    if (!isHydrated) {
      return;
    }

    // If testing mode not active, enable it
    if (!isTestingMode) {
      enableTestingMode();
      return;
    }

    // Testing mode is active, redirect to dashboard
    navigate('/dashboard', { replace: true });
  }, [isHydrated, isTestingMode, enableTestingMode, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center pt-20">
      <div className="text-emerald-400 animate-pulse text-lg">Enabling testing mode...</div>
    </div>
  );
}
