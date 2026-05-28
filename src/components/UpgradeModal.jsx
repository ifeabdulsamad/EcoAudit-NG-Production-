import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { initializePayment, getPlanDetails } from '../services/paystack'
import { X, Loader2, Check, Zap, Crown, Building2 } from 'lucide-react'
import './UpgradeModal.css'

const UpgradeModal = ({ isOpen, onClose, featureName }) => {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [processing, setProcessing] = useState(false)

  if (!isOpen) return null

  const handlePayment = (planType) => {
    if (!user) {
      alert('Please sign in first')
      return
    }

    setProcessing(true)
    initializePayment(user, planType, () => {
      setProcessing(false)
      onClose()
      alert('Payment successful! Your plan has been upgraded.')
      window.location.reload()
    })
  }

  const plans = [
    { id: 'pro', icon: Crown, ...getPlanDetails('pro') },
    { id: 'business', icon: Building2, ...getPlanDetails('business') },
  ]

  return (
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <motion.div 
        className="upgrade-modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="upgrade-close-btn" onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
        
        <div className="upgrade-header">
          <h2>Upgrade to Unlock</h2>
          {featureName && <p>{featureName} requires a Pro plan</p>}
        </div>

        <div className="plans-grid">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isSelected = selectedPlan === plan.id
            
            return (
              <div 
                key={plan.id}
                className={`plan-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="plan-top">
                  <div className="plan-icon">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="plan-title">
                    <h3>{plan.name}</h3>
                    <span className="price">{plan.price}</span>
                  </div>
                </div>

                <ul className="plan-features">
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx}>
                      <Check className="w-3.5 h-3.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`select-btn ${isSelected ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePayment(plan.id)
                  }}
                  disabled={processing}
                >
                  {processing && isSelected ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isSelected ? (
                    <>
                      <Zap className="w-4 h-4" />
                      Select
                    </>
                  ) : (
                    'Choose'
                  )}
                </button>
              </div>
            )
          })}
        </div>

        <div className="upgrade-footer">
          <p>Just need one report? <button className="link" onClick={() => handlePayment('one_time')} disabled={processing}>Pay ₦1,500 once</button></p>
        </div>
      </motion.div>
    </div>
  )
}

export default UpgradeModal