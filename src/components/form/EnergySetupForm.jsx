import { useAudit } from "../../context/AuditContext.jsx";
import { motion } from "framer-motion";
import { 
  Zap, 
  ArrowRight, 
  ArrowLeft,
  Gauge,
  Droplets,
  Grid3X3,
  AlertCircle
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import ApplianceSelector from "./ApplianceSelector";

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

export default function EnergySetupForm({ onNext, onPrev }) {
  const { auditData, updateAuditData, updateGenerator, setAppliances } = useAudit();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (auditData.appliances.length === 0) return;
    onNext();
  };

  const hasAppliances = auditData.appliances.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Generator Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Generator Setup</h3>
          </div>
          
          <Card className="bg-zinc-800/30 border-zinc-700/50 p-6 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <Gauge className="w-4 h-4 text-zinc-500" />
                  Generator Capacity (KVA)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  step="0.5"
                  value={auditData.generator.capacityKVA}
                  onChange={(e) => updateGenerator({ capacityKVA: Number(e.target.value) })}
                  className="h-12"
                />
                <p className="text-xs text-zinc-500">Typical small business: 5-10 KVA</p>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  Hours Used Per Day
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={auditData.generator.hoursPerDay}
                    onChange={(e) => updateGenerator({ hoursPerDay: Number(e.target.value) })}
                    className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="w-20 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                    <span className="text-lg font-semibold text-white">{auditData.generator.hoursPerDay}h</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                <Droplets className="w-4 h-4 text-zinc-500" />
                Fuel Type
              </label>
              <div className="flex gap-3">
                {["diesel", "petrol"].map((fuel) => (
                  <Card
                    key={fuel}
                    onClick={() => updateGenerator({ fuelType: fuel })}
                    className={`cursor-pointer transition-all duration-200 flex-1 ${
                      auditData.generator.fuelType === fuel
                        ? "bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/50"
                        : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <div className="p-4 text-center">
                      <span className={`text-sm font-medium capitalize ${
                        auditData.generator.fuelType === fuel ? "text-white" : "text-zinc-400"
                      }`}>
                        {fuel}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Grid Section */}
        <motion.div variants={itemVariants} className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Grid3X3 className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">PHCN Grid Supply</h3>
          </div>
          
          <Card className="bg-zinc-800/30 border-zinc-700/50 p-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                Average Grid Hours Per Day
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={auditData.gridHoursPerDay}
                  onChange={(e) => updateAuditData({ gridHoursPerDay: Number(e.target.value) })}
                  className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="w-20 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                  <span className="text-lg font-semibold text-white">{auditData.gridHoursPerDay}h</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500">Average daily hours of grid power availability</p>
            </div>
          </Card>
        </motion.div>

        {/* Appliances Section */}
        <motion.div variants={itemVariants} className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Your Appliances</h3>
            {hasAppliances && (
              <Badge variant="success" className="ml-2">
                {auditData.appliances.length} selected
              </Badge>
            )}
          </div>
          
          <ApplianceSelector
            selected={auditData.appliances}
            onUpdate={setAppliances}
          />
          
          {!hasAppliances && (
            <div className="flex items-center gap-2 mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-200">
                Please select at least one appliance to continue
              </p>
            </div>
          )}
        </motion.div>

        {/* Navigation - Desktop only (mobile uses fixed bottom nav) */}
        <motion.div variants={itemVariants} className="hidden sm:flex flex-col sm:flex-row gap-4 pt-8">
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={onPrev}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
          <Button 
            type="submit" 
            size="lg" 
            className="group"
            disabled={!hasAppliances}
          >
            Continue to Review
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
}

// Clock icon component
function Clock(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}