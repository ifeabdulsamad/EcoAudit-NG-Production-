import { useAudit } from "../../context/AuditContext.jsx";
import { motion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  Users, 
  Clock,
  ArrowRight,
  Store,
  ShoppingBag,
  Briefcase,
  Scissors,
  Pill,
  BedDouble,
  HelpCircle
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";

const BUSINESS_TYPES = [
  { value: "restaurant", label: "Restaurant / Food Service", icon: Store },
  { value: "retail", label: "Retail Shop", icon: ShoppingBag },
  { value: "office", label: "Office", icon: Briefcase },
  { value: "salon", label: "Salon / Barber", icon: Scissors },
  { value: "pharmacy", label: "Pharmacy", icon: Pill },
  { value: "hotel", label: "Hotel / Guest House", icon: BedDouble },
  { value: "other", label: "Other", icon: HelpCircle },
];

const BUSINESS_SIZES = [
  { value: "micro", label: "Micro", description: "1–5 employees" },
  { value: "small", label: "Small", description: "6–20 employees" },
  { value: "medium", label: "Medium", description: "21–100 employees" },
];

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

export default function BusinessProfileForm({ onNext }) {
  const { auditData, updateAuditData } = useAudit();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!auditData.businessType || !auditData.location || !auditData.size) return;
    onNext();
  };

  const isComplete = auditData.businessType && auditData.location && auditData.size;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Business Type */}
        <motion.div variants={itemVariants} className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Building2 className="w-4 h-4 text-emerald-400" />
            What type of business do you run?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {BUSINESS_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = auditData.businessType === type.value;
              return (
                <Card
                  key={type.value}
                  onClick={() => updateAuditData({ businessType: type.value })}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? "bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/50" 
                      : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800"
                  }`}
                >
                  <div className="p-4 flex flex-col items-center text-center gap-2">
                    <Icon className={`w-6 h-6 ${isSelected ? "text-emerald-400" : "text-zinc-500"}`} />
                    <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-zinc-400"}`}>
                      {type.label}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* Location */}
        <motion.div variants={itemVariants} className="space-y-4 pt-6">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <MapPin className="w-4 h-4 text-emerald-400" />
            Business Location
          </label>
          <Input
            placeholder="e.g., Ibadan, Oyo State"
            value={auditData.location}
            onChange={(e) => updateAuditData({ location: e.target.value })}
            className="h-12"
          />
          <p className="text-xs text-zinc-500">Enter your city and state for localized recommendations.</p>
        </motion.div>

        {/* Business Size */}
        <motion.div variants={itemVariants} className="space-y-4 pt-6">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Users className="w-4 h-4 text-emerald-400" />
            Business Size
          </label>
          <div className="grid grid-cols-3 gap-3">
            {BUSINESS_SIZES.map((size) => {
              const isSelected = auditData.size === size.value;
              return (
                <Card
                  key={size.value}
                  onClick={() => updateAuditData({ size: size.value })}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? "bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/50" 
                      : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800"
                  }`}
                >
                  <div className="p-4 text-center">
                    <div className={`text-base font-semibold mb-1 ${isSelected ? "text-white" : "text-zinc-400"}`}>
                      {size.label}
                    </div>
                    <div className="text-xs text-zinc-500">{size.description}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* Operating Hours */}
        <motion.div variants={itemVariants} className="space-y-4 pt-6">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Clock className="w-4 h-4 text-emerald-400" />
            Daily Operating Hours
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="24"
              value={auditData.operatingHours}
              onChange={(e) => updateAuditData({ operatingHours: Number(e.target.value) })}
              className="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="w-20 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
              <span className="text-lg font-semibold text-white">{auditData.operatingHours}h</span>
            </div>
          </div>
          <p className="text-xs text-zinc-500">Average hours your business operates per day.</p>
        </motion.div>

        {/* Submit - Desktop only (mobile uses fixed bottom nav) */}
        <motion.div variants={itemVariants} className="pt-8 hidden sm:block">
          <Button 
            type="submit" 
            size="lg" 
            className="group"
            disabled={!isComplete}
          >
            Continue to Energy Setup
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
}