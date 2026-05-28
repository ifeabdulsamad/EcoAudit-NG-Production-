import { useAuth } from '../context/AuthContext'
import { useTestingMode } from '../context/TestingModeContext'
import { useEffect, useState } from 'react'
import { getUserProfile } from '../api/auditApi'

export const useFeatureGate = () => {
  const { user } = useAuth()
  const { isTestingMode, fakeProfile } = useTestingMode()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isTestingMode) {
      // In testing mode, use fake business profile
      setProfile(fakeProfile)
      setLoading(false)
      return
    }

    if (user) {
      getUserProfile(user.id)
        .then(setProfile)
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user, isTestingMode, fakeProfile])

  const plan = profile?.plan ?? 'free'
  const isPro = plan === 'pro' || plan === 'business'
  const isBusiness = plan === 'business'
  const auditCount = profile?.audit_count ?? 0

  const canAccess = (feature) => {
    // In testing mode, all features are accessible
    if (isTestingMode) return true

    const freeFeatures = ['run_audit', 'energy_score', 'recommendations', 'solar_matches']
    const proFeatures = ['ai_report', 'pdf_export', 'save_audit', 'audit_history']
    const businessFeatures = ['compare_audits', 'multiple_locations', 'team_access', 'monthly_report', 'white_label_pdf']

    if (freeFeatures.includes(feature)) return true
    if (proFeatures.includes(feature)) return isPro
    if (businessFeatures.includes(feature)) return isBusiness
    return false
  }

  const canSaveAudit = () => {
    // Unlimited saves in testing mode
    if (isTestingMode) return true
    if (isBusiness) return true
    if (isPro) return auditCount < 5
    return auditCount < 1
  }

  const getAuditLimit = () => {
    if (isTestingMode) return Infinity
    if (isBusiness) return Infinity
    if (isPro) return 5
    return 1
  }

  return { 
    plan, 
    isPro, 
    isBusiness, 
    auditCount,
    canAccess, 
    canSaveAudit,
    getAuditLimit,
    loading,
    isTestingMode
  }
}