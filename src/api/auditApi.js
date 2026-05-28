import { supabase } from '../lib/supabase'

export const saveAudit = async (user, auditData, results) => {
  const { data, error } = await supabase
    .from('audits')
    .insert({
      user_id: user.id,
      business_name: auditData.businessName,
      location: auditData.location,
      energy_score: results.energyScore,
      audit_data: auditData,
      results: results,
    })

  if (error) throw error
  return data
}

export const getUserAudits = async (userId) => {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const deleteAudit = async (auditId) => {
  const { error } = await supabase
    .from('audits')
    .delete()
    .eq('id', auditId)

  if (error) throw error
}

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const updateUserPlan = async (userId, planType) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ plan: planType })
    .eq('id', userId)

  if (error) throw error
  return data
}

export const incrementAuditCount = async (userId) => {
  const { data, error } = await supabase.rpc('increment_audit_count', {
    user_id: userId
  })

  if (error) throw error
  return data
}