import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAudit } from "../../context/AuditContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTestingMode } from "../../context/TestingModeContext.jsx";
import AuthModal from "../AuthModal.jsx";
import UpgradeModal from "../UpgradeModal.jsx";
import ProfileDropdown from "./ProfileDropdown.jsx";
import {
  Home,
  ClipboardList,
  BarChart3,
  Menu,
  X,
  User,
  LogOut,
  FolderOpen,
  AlertTriangle,
  Power,
  Crown,
  Building2,
  MapPin,
  Users,
  FileText,
  Paintbrush,
  Settings,
  CreditCard
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/audit", label: "Audit", icon: ClipboardList },
];

function TestingBanner() {
  const { isTestingMode, disableTestingMode } = useTestingMode();
  
  if (!isTestingMode) return null;
  
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-semibold text-xs sm:text-sm">
            TESTING MODE: All features unlocked • No auth required
          </span>
        </div>
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={disableTestingMode}
          className="bg-white/20 hover:bg-white/30 text-white border-0 h-7 text-xs px-2"
        >
          <Power className="w-3 h-3 mr-1" />
          Exit
        </Button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { auditResults } = useAudit();
  const { user, signOut } = useAuth();
  const { isTestingMode } = useTestingMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Default to 'free' if no tier is found
  const tier = user?.user_metadata?.tier || 'free'; 
  const fullName = user?.user_metadata?.full_name || 'User';
  const businessName = user?.user_metadata?.business_name || '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allNavItems = auditResults
    ? [...navItems, { path: "/dashboard", label: "Dashboard", icon: BarChart3 }]
    : navItems;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      <TestingBanner />
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`${isTestingMode ? 'relative' : 'fixed top-0'} left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isTestingMode
            ? "bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50"
            : "bg-transparent"
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-400 flex items-center justify-center">
              <img src="/favicon.svg" alt="EcoAudit NG" className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white">
              EcoAudit <span className="text-emerald-400">NG</span>
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-emerald-500 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <ProfileDropdown setShowUpgradeModal={setShowUpgradeModal} />
            ) : (
              <>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-all"
                >
                  Sign In
                </button>
                <NavLink to="/audit">
                  <Button
                    size="sm"
                    className={
                      location.pathname === "/audit"
                        ? "opacity-0 pointer-events-none"
                        : ""
                    }
                  >
                    Start Audit
                  </Button>
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/50 overflow-y-auto max-h-[85vh]"
          >
            <div className="px-4 py-4 space-y-2">
              {/* If no user, show generic top level items */}
              {!user && allNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                );
              })}

              {user ? (
                <>
                  {/* Mobile Account Header */}
                  <div className="px-4 py-2 mb-2 flex items-center gap-3 border-b border-zinc-800 pb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {businessName || fullName}
                      </p>
                      <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                        {tier} Tier
                      </p>
                    </div>
                  </div>

                  <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                    <Home className="w-5 h-5" /> Home / New Audit
                  </NavLink>

                  {(tier === 'pro' || tier === 'business') && (
                    <NavLink to="/my-audits" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                      <FolderOpen className="w-5 h-5" /> Audit History
                    </NavLink>
                  )}

                  {tier === 'business' && (
                    <>
                      <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                        <MapPin className="w-5 h-5" /> Locations
                      </NavLink>
                      <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                        <Users className="w-5 h-5" /> Team
                      </NavLink>
                      <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                        <FileText className="w-5 h-5" /> Reports
                      </NavLink>
                      <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                        <Paintbrush className="w-5 h-5" /> White-label Settings
                      </NavLink>
                    </>
                  )}

                  <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                    <Settings className="w-5 h-5" /> Profile Settings
                  </NavLink>

                  {tier === 'free' ? (
                    <button onClick={() => { setShowUpgradeModal(true); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-left">
                      <Crown className="w-5 h-5" /> Upgrade to Pro
                    </button>
                  ) : (
                    <NavLink to="/billing" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                      <CreditCard className="w-5 h-5" /> Manage Subscription
                    </NavLink>
                  )}

                  <div className="pt-2 border-t border-zinc-800 mt-2">
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-zinc-800/50 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-zinc-800 space-y-2 mt-2">
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 w-full"
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </button>
                  <NavLink
                    to="/audit"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full">Start Audit</Button>
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
      </motion.nav>
    </>
  );
}
