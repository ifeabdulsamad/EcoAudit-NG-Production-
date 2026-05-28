import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const TESTING_MODE_KEY = 'ecoaudit_testing_mode'

// Fake user with business plan - all features unlocked
export const FAKE_USER = {
  id: 'testing-user-123',
  email: 'testing@ecoaudit.ng',
  user_metadata: {
    name: 'Testing User',
    avatar_url: null
  }
}

// Fake profile with business plan
export const FAKE_PROFILE = {
  id: 'testing-user-123',
  plan: 'business',
  audit_count: 0,
  created_at: new Date().toISOString()
}

const TestingModeContext = createContext({
  isTestingMode: false,
  isHydrated: false,
  enableTestingMode: () => {},
  disableTestingMode: () => {},
  fakeUser: FAKE_USER,
  fakeProfile: FAKE_PROFILE
})

export const TestingModeProvider = ({ children }) => {
  const [isTestingMode, setIsTestingMode] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Check localStorage on mount
    const stored = localStorage.getItem(TESTING_MODE_KEY)
    if (stored === 'true') {
      setIsTestingMode(true)
    }
    setIsHydrated(true)
  }, [])

  const enableTestingMode = useCallback(() => {
    localStorage.setItem(TESTING_MODE_KEY, 'true')
    setIsTestingMode(true)
  }, [])

  const disableTestingMode = useCallback(() => {
    localStorage.removeItem(TESTING_MODE_KEY)
    setIsTestingMode(false)
    // Reload to clear any cached state
    window.location.href = '/'
  }, [])

  return (
    <TestingModeContext.Provider value={{ 
      isTestingMode, 
      isHydrated,
      enableTestingMode, 
      disableTestingMode,
      fakeUser: FAKE_USER,
      fakeProfile: FAKE_PROFILE
    }}>
      {children}
    </TestingModeContext.Provider>
  )
}

export const useTestingMode = () => useContext(TestingModeContext)
