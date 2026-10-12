import { updateUserPlan } from '../api/auditApi'

const PLANS = {
  pro: 300000,
  business: 800000,
  one_time: 150000,
}

const PLAN_CODES = {
  pro: import.meta.env.VITE_PAYSTACK_PRO_PLAN,
  business: import.meta.env.VITE_PAYSTACK_BUSINESS_PLAN,
}

export const initializePayment = (user, planType, onSuccess) => {
  const planCode = PLAN_CODES[planType];
  
  const paystackConfig = {
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: user.email,
    currency: 'NGN',
    ref: `ecoaudit_${planType}_${Date.now()}`,
    metadata: {
      user_id: user.id,
      plan_type: planType,
    },
    onClose: () => {
      console.log('Payment closed')
    },
    callback: function(response) {
      try {
        if (response.status === 'success') {
          if (planType !== 'one_time') {
            updateUserPlan(user.id, planType)
              .then(() => onSuccess(response))
              .catch((error) => {
                console.error('Payment callback error:', error)
                alert('Plan update failed: ' + (error.message || JSON.stringify(error)))
              });
          } else {
            onSuccess(response);
          }
        }
      } catch (error) {
        console.error('Payment callback error:', error)
      }
    }
  };

  if (planCode && typeof planCode === 'string' && planCode.trim() !== '') {
    paystackConfig.plan = planCode;
  } else {
    paystackConfig.amount = PLANS[planType];
  }

  console.log("--- PAYSTACK DEBUG ---");
  console.log("Config sent to Paystack:", paystackConfig);
  
  if (!paystackConfig.key) {
    alert("Paystack Error: Public Key is missing from .env");
    return;
  }
  if (!paystackConfig.email) {
    alert("Paystack Error: User email is missing");
    return;
  }
  if (!paystackConfig.amount && !paystackConfig.plan) {
    alert("Paystack Error: Amount and Plan are both missing");
    return;
  }

  if (typeof window.PaystackPop === 'undefined') {
    alert("Paystack script failed to load! Please turn off your Adblocker for localhost and refresh the page.");
    return;
  }

  const handler = window.PaystackPop.setup(paystackConfig);
  handler.openIframe();
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