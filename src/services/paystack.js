import { updateUserPlan } from '../api/auditApi'

const PLANS = {
  pro: 300000,
  business: 800000,
  one_time: 150000,
}

export const initializePayment = (user, planType, onSuccess) => {
  const handler = PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: user.email,
    amount: PLANS[planType],
    currency: 'NGN',
    ref: `ecoaudit_${planType}_${Date.now()}`,
    metadata: {
      user_id: user.id,
      plan_type: planType,
    },
    onClose: () => {
      console.log('Payment closed')
    },
    callback: async (response) => {
      try {
        if (response.status === 'success') {
          if (planType !== 'one_time') {
            await updateUserPlan(user.id, planType)
          }
          onSuccess(response)
        }
      } catch (error) {
        console.error('Payment callback error:', error)
        alert('Payment processed but plan update failed. Please contact support.')
      }
    }
  })
  
  handler.openIframe()
}

export const getPlanDetails = (planType) => {
  const plans = {
    pro: {
      name: 'Pro Plan',
      price: '₦3,000/month',
      features: [
        'Unlimited audits (up to 5 saved)',
        'AI-generated reports',
        'PDF export',
        'Audit history'
      ]
    },
    business: {
      name: 'Business Plan',
      price: '₦8,000/month',
      features: [
        'Everything in Pro',
        'Unlimited saved audits',
        'Compare audits',
        'Multiple locations/branches',
        'Team access (3 users)',
        'Monthly energy report email',
        'White label PDF'
      ]
    },
    one_time: {
      name: 'Single AI Report',
      price: '₦1,500 one-time',
      features: [
        'One AI-generated report',
        'PDF export',
        'No subscription required'
      ]
    }
  }
  
  return plans[planType]
}