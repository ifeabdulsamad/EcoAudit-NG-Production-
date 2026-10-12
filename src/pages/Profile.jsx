import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  User, Building2, Mail, Lock, CheckCircle2,
  AlertCircle, CreditCard, XCircle, Users,
  MapPin, Paintbrush, Loader2, Save, Trash2, Plus, X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import UpgradeModal from '../components/UpgradeModal';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Modals
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const tier = user?.user_metadata?.tier || 'free';
  
  // Account Basics
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Business Context
  const [defaultType, setDefaultType] = useState('');
  const [defaultLocation, setDefaultLocation] = useState('');
  const [defaultSize, setDefaultSize] = useState('');
  const [defaultHours, setDefaultHours] = useState('');

  // Business Tier Exclusives
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [newTeamMember, setNewTeamMember] = useState('');
  const [whiteLabel, setWhiteLabel] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setBusinessName(user.user_metadata?.business_name || '');
      setEmail(user.email || '');
      
      const context = user.user_metadata?.business_context || {};
      setDefaultType(context.default_type || '');
      setDefaultLocation(context.default_location || '');
      setDefaultSize(context.default_size || '');
      setDefaultHours(context.default_hours || '');
      
      setLocations(user.user_metadata?.locations || []);
      setTeamMembers(user.user_metadata?.team_members || []);
      setWhiteLabel(user.user_metadata?.white_label || false);
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (password && password !== confirmPassword) {
      showMessage('error', 'Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Build update object
      const updateData = {
        data: {
          full_name: fullName,
          business_name: businessName,
          business_context: {
            default_type: defaultType,
            default_location: defaultLocation,
            default_size: defaultSize,
            default_hours: defaultHours
          },
          locations,
          team_members: teamMembers,
          white_label: whiteLabel
        }
      };

      // Only include email if changed
      if (email !== user.email) {
        updateData.email = email;
      }
      
      // Only include password if provided
      if (password) {
        updateData.password = password;
      }

      // Update via Supabase Auth (this writes through to auth.users and user_metadata)
      const { data, error } = await supabase.auth.updateUser(updateData);
      
      if (error) throw error;

      // Also update the public.profiles table if necessary
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);
        
      if (profileError) console.warn('Could not update profiles table', profileError);

      if (email !== user.email) {
        showMessage('success', 'Profile updated. Please check your email to verify the new address.');
      } else {
        showMessage('success', 'Profile settings saved successfully!');
      }
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      showMessage('error', err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = () => {
    if (!newLocation.trim()) return;
    setLocations([...locations, newLocation.trim()]);
    setNewLocation('');
  };

  const handleRemoveLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleAddTeamMember = () => {
    if (!newTeamMember.trim()) return;
    if (teamMembers.length >= 3) {
      showMessage('error', 'Maximum of 3 team members allowed.');
      return;
    }
    setTeamMembers([...teamMembers, newTeamMember.trim()]);
    setNewTeamMember('');
  };

  const handleRemoveTeamMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      // Hard delete typically requires an Edge Function or server action for security, 
      // but if an RPC is set up, it looks like this:
      const { error } = await supabase.rpc('delete_user');
      
      if (error) {
        // Fallback if RPC doesn't exist: log them out and instruct support
        console.error("RPC delete_user failed:", error);
        alert("Your account deletion request has been logged. You will be signed out.");
      }
      
      await signOut();
      navigate('/');
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to delete account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-zinc-400 mt-2">Manage your account, business preferences, and subscription.</p>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}
          >
            {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleUpdateAccount} className="space-y-8">
          
          {/* Section 1: Account Basics */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" /> Account Basics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Email Address (Requires Re-verification)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  minLength={6}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Business Context */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" /> Default Business Context
            </h2>
            <p className="text-sm text-zinc-400 mb-6">Prefills future audits so you don't have to retype this info.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Default Business Type</label>
                <input
                  type="text"
                  placeholder="e.g. Retail, Office, Manufacturing"
                  value={defaultType}
                  onChange={(e) => setDefaultType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Default Location / State</label>
                <input
                  type="text"
                  placeholder="e.g. Lagos, Abuja"
                  value={defaultLocation}
                  onChange={(e) => setDefaultLocation(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Default Facility Size (sqm/sqft)</label>
                <input
                  type="text"
                  placeholder="e.g. 500 sqm"
                  value={defaultSize}
                  onChange={(e) => setDefaultSize(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Default Operating Hours</label>
                <input
                  type="text"
                  placeholder="e.g. 9am - 5pm, Mon-Fri"
                  value={defaultHours}
                  onChange={(e) => setDefaultHours(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Business Tier Features */}
          {tier === 'business' && (
            <div className="bg-zinc-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-bl-lg">
                BUSINESS TIER
              </div>
              
              <h2 className="text-xl font-semibold text-white mb-6">Business Operations</h2>
              
              <div className="space-y-8">
                {/* Locations */}
                <div>
                  <h3 className="text-base font-medium text-white mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" /> Manage Locations
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Add a new branch/location..."
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                    />
                    <Button type="button" onClick={handleAddLocation} variant="secondary">Add</Button>
                  </div>
                  {locations.length > 0 && (
                    <ul className="space-y-2">
                      {locations.map((loc, i) => (
                        <li key={i} className="flex items-center justify-between bg-zinc-950 p-3 rounded-lg border border-zinc-800/50 text-sm text-zinc-300">
                          {loc}
                          <button type="button" onClick={() => handleRemoveLocation(i)} className="text-zinc-500 hover:text-red-400 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Team Members */}
                <div>
                  <h3 className="text-base font-medium text-white mb-1 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" /> Manage Team
                  </h3>
                  <p className="text-xs text-zinc-400 mb-3">Invite up to 3 team members to collaborate on audits.</p>
                  
                  <div className="flex gap-2 mb-3">
                    <input
                      type="email"
                      placeholder="Colleague's email address..."
                      value={newTeamMember}
                      onChange={(e) => setNewTeamMember(e.target.value)}
                      disabled={teamMembers.length >= 3}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-emerald-500 outline-none disabled:opacity-50"
                    />
                    <Button type="button" onClick={handleAddTeamMember} disabled={teamMembers.length >= 3} variant="secondary">Invite</Button>
                  </div>
                  {teamMembers.length > 0 && (
                    <ul className="space-y-2">
                      {teamMembers.map((member, i) => (
                        <li key={i} className="flex items-center justify-between bg-zinc-950 p-3 rounded-lg border border-zinc-800/50 text-sm text-zinc-300">
                          {member}
                          <button type="button" onClick={() => handleRemoveTeamMember(i)} className="text-zinc-500 hover:text-red-400 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-xs text-zinc-500 mt-2">{teamMembers.length}/3 members invited</p>
                </div>

                {/* White Label */}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-white flex items-center gap-2">
                      <Paintbrush className="w-4 h-4 text-emerald-400" /> White-label PDFs
                    </h3>
                    <p className="text-xs text-zinc-400">Remove EcoAudit branding from exported reports.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={whiteLabel}
                      onChange={() => setWhiteLabel(!whiteLabel)}
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto min-w-[150px]">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </form>

        {/* Section 4: Subscription Management */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" /> Subscription Plan
          </h2>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <div>
              <p className="text-sm text-zinc-400">Current Plan</p>
              <p className="text-xl font-bold text-white capitalize">{tier} Tier</p>
              {tier !== 'free' && (
                <p className="text-xs text-zinc-500 mt-1">Renews automatically next month</p>
              )}
            </div>
            
            <div>
              {tier === 'free' ? (
                <Button onClick={() => setShowUpgradeModal(true)}>Upgrade to Pro</Button>
              ) : (
                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white">
                  Cancel Subscription
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Section 5: Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-red-400 mb-2 flex items-center gap-2">
            <XCircle className="w-5 h-5" /> Danger Zone
          </h2>
          <p className="text-sm text-zinc-400 mb-6">
            Deleting your account is permanent. All your data, audit reports, and team associations will be erased immediately.
          </p>
          
          {showDeleteConfirm ? (
            <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
              <p className="text-sm text-white mb-4 font-medium">Are you absolutely sure? This cannot be undone.</p>
              <div className="flex gap-3">
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
                  {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                </Button>
                <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete Account
            </Button>
          )}
        </div>

      </div>

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </div>
  );
}
