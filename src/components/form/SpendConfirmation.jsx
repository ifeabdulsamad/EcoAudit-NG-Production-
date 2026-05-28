import { useAudit } from "../../context/AuditContext.jsx";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Building2,
  Zap,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatNaira } from "../../lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function SpendConfirmation({ onSubmit }) {
  const { auditData, updateAuditData } = useAudit();

  // Calculate estimated fuel spend
  const genKva = auditData.generator?.capacityKVA || 5;
  const genHours = auditData.generator?.hoursPerDay || 8;
  const kW = genKva * 0.8 * 0.85;
  const litresPerHour = kW * 0.7 * 0.28;
  const dailyLitres = litresPerHour * genHours;
  const estimatedMonthlySpend = dailyLitres * 30 * 1650;
  
  const actualSpend = auditData.monthlyFuelSpend || estimatedMonthlySpend;
  const totalAppliances = auditData.appliances?.length || 0;
  const totalItems = auditData.appliances?.reduce((s, a) => s + a.quantity, 0) || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const summaryItems = [
    { label: "Business Type", value: auditData.businessType, icon: Building2 },
    { label: "Location", value: auditData.location, icon: Building2 },
    { label: "Size", value: auditData.size, icon: Building2 },
    { label: "Operating Hours", value: `${auditData.operatingHours}h/day`, icon: Clock },
    { label: "Generator", value: `${auditData.generator.capacityKVA}KVA, ${auditData.generator.hoursPerDay}h/day`, icon: Zap },
    { label: "Grid Hours", value: `${auditData.gridHoursPerDay}h/day`, icon: Zap },
    { label: "Appliances", value: `${totalAppliances} types (${totalItems} items)`, icon: Zap },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Summary Card */}
        <motion.div variants={itemVariants}>
          <Card className="bg-zinc-800/30 border-zinc-700/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Business Summary</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {summaryItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                    <span className="text-sm text-zinc-500">{item.label}</span>
                    <span className="text-sm font-medium text-white capitalize">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fuel Spend Section */}
        <motion.div variants={itemVariants} className="pt-6">
          <Card className="bg-gradient-to-br from-amber-500/10 via-zinc-900/50 to-zinc-900/50 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Monthly Fuel Spend</h3>
                  <p className="text-sm text-zinc-400">Enter your actual spend for more accurate results</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-zinc-300">
                      Based on your generator usage, we estimate{" "}
                      <span className="font-semibold text-amber-400">{formatNaira(estimatedMonthlySpend)}</span>{" "}
                      per month
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Your actual monthly fuel spend (₦)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder={estimatedMonthlySpend.toLocaleString()}
                    value={auditData.monthlyFuelSpend || ""}
                    onChange={(e) => updateAuditData({ monthlyFuelSpend: Number(e.target.value) || 0 })}
                    className="h-12 text-lg"
                  />
                  <p className="text-xs text-zinc-500">
                    Leave blank to use the estimated amount
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ready to Audit */}
        <motion.div variants={itemVariants} className="pt-6">
          <Card className="bg-gradient-to-br from-emerald-500/10 via-zinc-900/50 to-zinc-900/50 border-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Ready to Generate Your Audit</h3>
                  <p className="text-sm text-zinc-400 mb-4">
                    We&apos;ll analyze your energy profile and provide:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Complete energy efficiency score",
                      "Detailed cost breakdown and carbon footprint",
                      "Personalized savings recommendations",
                      "Solar viability analysis with real vendor pricing",
                      "AI-powered audit report"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation - Desktop only (mobile uses fixed bottom nav) */}
        <motion.div variants={itemVariants} className="hidden sm:flex flex-col sm:flex-row gap-4 pt-8">
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
          <Button 
            type="submit" 
            size="lg" 
            className="group"
          >
            <Sparkles className="mr-2 w-4 h-4" />
            Generate Energy Audit
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
}