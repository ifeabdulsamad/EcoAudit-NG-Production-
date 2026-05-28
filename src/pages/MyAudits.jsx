import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAudit } from '../context/AuditContext'
import { getUserAudits, deleteAudit } from '../api/auditApi'
import { useNavigate } from 'react-router-dom'
import { Crown } from 'lucide-react'
import './MyAudits.css'

const MyAudits = () => {
  const { user } = useAuth()
  const { loadSavedAudit } = useAudit()
  const navigate = useNavigate()
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadAudits()
    }
  }, [user])

  const loadAudits = async () => {
    try {
      const data = await getUserAudits(user.id)
      setAudits(data)
    } catch (error) {
      console.error('Failed to load audits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this audit?')) return
    
    try {
      await deleteAudit(id)
      setAudits(audits.filter(a => a.id !== id))
    } catch (error) {
      console.error('Failed to delete audit:', error)
      alert('Failed to delete audit. Please try again.')
    }
  }

  const loadAudit = (audit) => {
    loadSavedAudit(audit)
    navigate('/dashboard')
  }

  const startNewAudit = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="my-audits-container">
        <div className="loading">Loading your audits...</div>
      </div>
    )
  }

  return (
    <div className="my-audits-container">
      <div className="my-audits-header">
        <h2>My Audits</h2>
        <div className="header-actions">
          <button className="pricing-btn" onClick={() => navigate('/pricing')}>
            <Crown className="w-4 h-4" />
            Upgrade
          </button>
          <button className="new-audit-btn" onClick={startNewAudit}>
            + New Audit
          </button>
        </div>
      </div>

      {audits.length === 0 ? (
        <div className="no-audits">
          <p>No saved audits yet. Run your first audit!</p>
          <button className="start-audit-btn" onClick={startNewAudit}>
            Start Free Audit
          </button>
        </div>
      ) : (
        <div className="audits-list">
          {audits.map(audit => (
            <div key={audit.id} className="audit-card">
              <div className="audit-info">
                <h3>{audit.business_name}</h3>
                <p className="audit-location">{audit.location}</p>
                <div className="audit-meta">
                  <span className="energy-score">Score: {audit.energy_score}/100</span>
                  <span className="audit-date">
                    {new Date(audit.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="audit-actions">
                <button className="view-btn" onClick={() => loadAudit(audit)}>
                  View
                </button>
                <button className="delete-btn" onClick={() => handleDelete(audit.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAudits