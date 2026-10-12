import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, LogOut, Settings, CreditCard, 
  ChevronDown, Crown, Building2, MapPin, 
  Users, FileText, Paintbrush,
  Home, FolderOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileDropdown({ setShowUpgradeModal }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Default to 'free' if no tier is found
  const tier = user?.user_metadata?.tier || 'free'; 
  const fullName = user?.user_metadata?.full_name || 'User';
  const businessName = user?.user_metadata?.business_name || '';
  const email = user?.email || '';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-3 border-l border-zinc-800 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <User className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex flex-col items-start hidden sm:flex">
          <span className="text-sm font-medium text-zinc-300 max-w-[120px] truncate">
            {businessName || fullName}
          </span>
          {tier !== 'free' && (
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
              {tier} Plan
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header section */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
              <NavLink to="/profile" onClick={handleLinkClick} className="block group">
                <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                  {businessName || fullName}
                </p>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{email}</p>
              </NavLink>
              
              <div className="mt-3 flex items-center justify-between bg-zinc-800/50 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  {tier === 'pro' && <Crown className="w-4 h-4 text-amber-400" />}
                  {tier === 'business' && <Building2 className="w-4 h-4 text-emerald-400" />}
                  {tier === 'free' && <User className="w-4 h-4 text-zinc-400" />}
                  <span className="text-xs font-medium capitalize text-zinc-300">
                    {tier} Tier
                  </span>
                </div>
                {tier !== 'free' && (
                  <span className="text-[10px] text-zinc-500">Renews Oct 1</span>
                )}
              </div>
            </div>

            <div className="p-2 space-y-1">
              {/* Home / New Audit - Common to all */}
              <NavLink to="/" onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50">
                <Home className="w-4 h-4" /> Home / New Audit
              </NavLink>

              {/* Pro and Business Only: Audit History */}
              {(tier === 'pro' || tier === 'business') && (
                <NavLink to="/my-audits" onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50">
                  <FolderOpen className="w-4 h-4" /> Audit History
                </NavLink>
              )}

              {/* Business Tier Exclusive Features */}
              {tier === 'business' && (
                <>
                  <div className="h-px bg-zinc-800 my-2 mx-2"></div>
                  <NavLink to="/profile" onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50">
                    <MapPin className="w-4 h-4" /> Locations
                  </NavLink>
                  <NavLink to="/profile" onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50">
                    <Users className="w-4 h-4" /> Team
                  </NavLink>
                  <NavLink to="/profile" onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50">
                    <FileText className="w-4 h-4" /> Reports
                  </NavLink>
                  <NavLink to="/profile" onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50">
                    <Paintbrush className="w-4 h-4" /> White-label Settings
                  </NavLink>
                </>
              )}

              <div className="h-px bg-zinc-800 my-2 mx-2"></div>

              {/* Common profile settings */}
              <NavLink to="/profile" onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50">
                <Settings className="w-4 h-4" /> Profile Settings
              </NavLink>

              {/* Billing / Upgrade */}
              {tier === 'free' ? (
                <button 
                  onClick={() => {
                    handleLinkClick();
                    setShowUpgradeModal(true);
                  }} 
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                >
                  <Crown className="w-4 h-4" /> Upgrade to Pro
                </button>
              ) : (
                <NavLink to="/billing" onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50">
                  <CreditCard className="w-4 h-4" /> Manage Subscription
                </NavLink>
              )}

              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
