import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { initializePayment } from '../services/paystack'
import { Check, X, Zap, Crown, Building2, Loader2 } from 'lucide-react'
import './Pricing.css'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '₦0',
    period: 'forever',
    icon: Zap,
    color: 'zinc',
    features: {
      'Run energy audit': true,
      'Energy score': true,
      'Basic recommendations': true,
      'Solar merchant matches': true,
      'AI-generated report': false,
      'PDF export': false,
      'Save audits': '1 only',
      'Audit history': false,
      'Compare audits': false,
      'Multiple branches': false,
      'Team access': false,
      'Monthly email report': false,
      'White label PDF': false,
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₦3,000',
    period: '/month',
    icon: Crown,
    color: 'emerald',
    popular: true,
    features: {
      'Run energy audit': true,
      'Energy score': true,
      'Basic recommendations': true,
      'Solar merchant matches': true,
      'AI-generated report': true,
      'PDF export': true,
      'Save audits': '5 audits',
      'Audit history': true,
      'Compare audits': false,
      'Multiple branches': false,
      'Team access': false,
      'Monthly email report': false,
      'White label PDF': false,
    }
  },
  {
    id: 'business',
    name: 'Business',
    price: '₦8,000',
    period: '/month',
    icon: Building2,
    color: 'violet',
    features: {
      'Run energy audit': true,
      'Energy score': true,
      'Basic recommendations': true,
      'Solar merchant matches': true,
      'AI-generated report': true,
      'PDF export': true,
      'Save audits': 'Unlimited',
      'Audit history': true,
      'Compare audits': true,
      'Multiple branches': true,
      'Team access': '3 users',
      'Monthly email report': true,
      'White label PDF': true,
    }
  }
]

const featureOrder = [
  'Run energy audit',
  'Energy score', 
  'Basic recommendations',
  'Solar merchant matches',
  'AI-generated report',
  'PDF export',
  'Save audits',
  'Audit history',
  'Compare audits',
  'Multiple branches',
  'Team access',
  'Monthly email report',
  'White label PDF'
]

export default function Pricing() {
  const { user } = useAuth()
  const [processing, setProcessing] = useState(null)

  const handleSubscribe = (planId) => {
    if (!user) {
      alert('Please sign in first')
      return
    }
    if (planId === 'free') return

    setProcessing(planId)
    initializePayment(user, planId, () => {
      setProcessing(null)
      alert('Payment successful!')
      window.location.reload()
    })
  }

  return (
    <div className="pricing-page">
      <div className="pricing-container">
        <div className="pricing-header">
          <h1>Simple Pricing</h1>
          <p>Choose the plan that fits your business</p>
        </div>

        <div className="pricing-table">
          {/* Header Row */}
          <div className="table-header">
            <div className="feature-col">Features</div>
            {plans.map(plan => {
              const Icon = plan.icon
              return (
                <div key={plan.id} className={`plan-col ${plan.id}`}>
                  {plan.popular && <span className="popular-tag">Popular</span>}
                  <div className={`plan-icon ${plan.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="amount">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Feature Rows */}
          <div className="table-body">
            {featureOrder.map((feature, idx) => (
              <div key={feature} className="feature-row" style={{ animationDelay: `${idx * 0.02}s` }}>
                <div className="feature-name">{feature}</div>
                {plans.map(plan => {
                  const value = plan.features[feature]
                  return (
                    <div key={plan.id} className={`feature-value ${plan.id}`}>
                      {value === true ? (
                        <Check className="w-5 h-5 check-icon" />
                      ) : value === false ? (
                        <X className="w-5 h-5 x-icon" />
                      ) : (
                        <span className="text-value">{value}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* CTA Row */}
          <div className="table-footer">
            <div className="feature-col" />
            {plans.map(plan => (
              <div key={plan.id} className={`plan-col ${plan.id}`}>
                {plan.id === 'free' ? (
                  <span className="current-plan">Current</span>
                ) : (
                  <button 
                    className={`subscribe-btn ${plan.color}`}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={processing}
                  >
                    {processing === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Subscribe
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pricing-footer">
          <p>Need just one report? <button className="text-link" onClick={() => handleSubscribe('one_time')}>Pay ₦1,500 once</button></p>
        </div>
      </div>
    </div>
  )
}