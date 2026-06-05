import { useAudit } from "../context/AuditContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useFeatureGate } from "../hooks/useFeatureGate.js";
import { saveAudit } from "../api/auditApi.js";
import AuthModal from "../components/AuthModal.jsx";
import UpgradeModal from "../components/UpgradeModal.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  Wallet,
  Globe,
  Lightbulb,
  Sun,
  Brain,
  ArrowRight,
  Plus,
  Download,
  Building2,
  MapPin,
  TrendingDown,
  Leaf,
  Save,
  Lock,
  Check,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { formatNaira } from "../lib/utils";
import { useSolarVendors } from "../hooks/useSolarVendors";
import EnergyScoreMeter from "../components/dashboard/EnergyScoreMeter";
import ConsumptionChart from "../components/dashboard/ConsumptionChart";
import CarbonCard from "../components/dashboard/CarbonCard";
import CostCard from "../components/dashboard/CostCard";
import AIReport from "../components/dashboard/AIReport";
import RecommendationCards from "../components/dashboard/RecommendationCards";
import SolarVerdictCard from "../components/dashboard/SolarVerdictCard";
import ExportButton from "../components/shared/ExportButton";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function EmptyState() {
  const navigate = useNavigate();
  const { reset } = useAudit();

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-16 flex items-center justify-center">
      <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md mx-auto px-4"
      >
        <Card className="bg-zinc-900/80 backdrop-blur-xl border-zinc-800 text-center p-8">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            No Audit Data Found
          </h2>
          <p className="text-zinc-400 mb-8">
            Complete an energy audit first to see your personalized dashboard
            with energy score, cost breakdown, and savings recommendations.
          </p>
          <Button
            size="lg"
            className="w-full group"
            onClick={() => {
              reset();
              navigate("/audit");
            }}
          >
            Start Your Audit
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}

function DashboardHeader({
  auditData,
  auditResults,
  onSave,
  canSave,
  isSaved,
}) {
  const navigate = useNavigate();
  const { reset } = useAudit();

  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8"
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          >
            <img
              src="/favicon.svg"
              alt="EcoAudit NG"
              className="w-3 h-3 mr-1"
            />
            {/* <Leaf className="w-3 h-3 mr-1" /> */}
            Audit Complete
          </Badge>
          <span className="text-sm text-zinc-500">
            {new Date().toLocaleDateString("en-NG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Energy Audit <span className="text-emerald-400">Results</span>
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="capitalize">{auditData.businessType}</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{auditData.location}</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400">
              {formatNaira(
                auditResults.recommendations?.reduce(
                  (sum, r) => sum + (r.savings || 0),
                  0,
                ) || 0,
              )}{" "}
              potential savings
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {isSaved ? (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-2">
            <Check className="w-4 h-4 mr-2" />
            Saved
          </Badge>
        ) : (
          <Button
            onClick={onSave}
            disabled={!canSave}
            className={!canSave ? "opacity-50" : ""}
          >
            <Save className="mr-2 w-4 h-4" />
            Save Audit
          </Button>
        )}
        <ExportButton
          businessName={auditData.businessType}
          onUpgradeRequired={() => setShowUpgradeModal(true)}
        />
        <Button
          variant="outline"
          onClick={() => {
            reset();
            navigate("/audit");
          }}
        >
          <Plus className="mr-2 w-4 h-4" />
          New Audit
        </Button>
      </div>
    </motion.div>
  );
}

function StatCards({ auditResults }) {
  const stats = [
    {
      icon: Zap,
      label: "Annual Consumption",
      value: `${auditResults.totalAnnualKwh.toLocaleString()}`,
      unit: "kWh",
      color: "emerald",
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      icon: Wallet,
      label: "Total Annual Cost",
      value: formatNaira(auditResults.totalAnnualCost),
      unit: "",
      color: "cyan",
      gradient: "from-cyan-400 to-cyan-600",
    },
    {
      icon: Globe,
      label: "CO₂ Emissions",
      value: (auditResults.totalAnnualCo2 / 1000).toFixed(1),
      unit: "tonnes/year",
      color: "rose",
      gradient: "from-rose-400 to-rose-600",
    },
  ];

  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
    >
      {stats.map((stat, i) => (
        <Card key={i} className="glass-card-hover group">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="text-sm text-zinc-500">{stat.unit}</span>
                  )}
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
}

export default function Dashboard() {
  const { auditResults, auditData, reset } = useAudit();
  const { user } = useAuth();
  const { canSaveAudit, isPro, canAccess } = useFeatureGate();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch fresh solar vendor data
  const {
    solarData,
    loading: solarLoading,
    isFresh,
    isFallback,
    refresh,
  } = useSolarVendors(auditResults);

  if (!auditResults) {
    return <EmptyState />;
  }

  const {
    score,
    totalAnnualCo2,
    totalAnnualCost,
    totalAnnualKwh,
    applianceResults,
    recommendations,
    carbonComparisons,
    effectiveMonthlyFuelCost,
    auditSummary,
  } = auditResults;

  const handleSaveAudit = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!canSaveAudit()) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      setSaving(true);
      await saveAudit(user, auditData, auditResults);
      setIsSaved(true);
    } catch (error) {
      console.error("Failed to save audit:", error);
      alert("Failed to save audit. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-16">
      {/* Background effects */}
      <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none" />
      <div className="fixed inset-0 mesh-bg opacity-20 pointer-events-none" />

      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        id="dashboard-content"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <DashboardHeader
            auditData={auditData}
            auditResults={auditResults}
            onSave={handleSaveAudit}
            canSave={canSaveAudit() && !saving}
            isSaved={isSaved}
          />

          <StatCards auditResults={auditResults} />

          {/* Disclaimer */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm text-zinc-400">
                Estimates based on standard appliance ratings and Nigerian grid
                averages. Actual costs may vary based on specific usage patterns
                and local conditions.
              </p>
            </div>
          </motion.div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Score & Cost */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-4 space-y-6"
            >
              <EnergyScoreMeter score={score} />
              <CostCard
                annualCost={totalAnnualCost}
                monthlyFuelCost={effectiveMonthlyFuelCost}
                gridHoursPerDay={auditSummary.gridHoursPerDay}
                genHoursPerDay={auditSummary.genHoursPerDay}
              />
            </motion.div>

            {/* Middle Column - Carbon & Chart */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-4 space-y-6"
            >
              <CarbonCard
                totalCo2={totalAnnualCo2}
                comparisons={carbonComparisons}
              />
            </motion.div>

            {/* Right Column - Recommendations */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-4 space-y-6"
            >
              <RecommendationCards recommendations={recommendations} />
            </motion.div>

            {/* Full Width - Consumption Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-8">
              <ConsumptionChart applianceResults={applianceResults} />
            </motion.div>

            {/* Solar Verdict */}
            <motion.div variants={itemVariants} className="lg:col-span-4">
              <SolarVerdictCard
                solarData={solarData}
                loading={solarLoading}
                isFresh={isFresh}
                isFallback={isFallback}
                onRefresh={refresh}
              />
            </motion.div>

            {/* Full Width - AI Report */}
            <motion.div variants={itemVariants} className="lg:col-span-12">
              {canAccess("ai_report") ? (
                <AIReport auditResults={auditResults} />
              ) : (
                <Card className="bg-zinc-900/80 backdrop-blur-xl border-zinc-800">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      AI Report
                    </h3>
                    <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                      Get a detailed AI-generated energy audit report with
                      personalized recommendations and insights.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <Button onClick={() => setShowUpgradeModal(true)}>
                        <Lock className="w-4 h-4 mr-2" />
                        Unlock AI Report
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/pricing")}
                      >
                        View Plans
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          // After successful auth, try saving again
          handleSaveAudit();
        }}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Save Audit"
      />
    </div>
  );
}
