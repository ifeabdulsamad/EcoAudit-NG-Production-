import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useTestingMode, FAKE_USER } from './TestingModeContext'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isTestingMode, disableTestingMode } = useTestingMode()

  useEffect(() => {
    if (isTestingMode) {
      // Return fake user immediately in testing mode
      setUser(FAKE_USER)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [isTestingMode])

  const signInWithGoogle = async () => {
    // Bypass in testing mode
    if (isTestingMode) {
      return { data: { user: FAKE_USER }, error: null }
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signInWithEmail = async (email, password) => {
    if (isTestingMode) {
      return { data: { user: FAKE_USER }, error: null }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signUpWithEmail = async (email, password) => {
    if (isTestingMode) {
      return { data: { user: FAKE_USER }, error: null }
    }
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    // Disable testing mode on sign out
    if (isTestingMode) {
      disableTestingMode()
      return
    }
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)