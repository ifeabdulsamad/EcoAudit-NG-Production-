import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Minus, 
  Plus, 
  Trash2,
  Snowflake,
  Flame,
  Lightbulb,
  Monitor,
  Settings,
  Check,
  Refrigerator,
  Wind,
  Droplets,
  UtensilsCrossed,
  Microwave,
  Coffee,
  Blender,
  Lamp,
  Tv,
  Laptop,
  Printer,
  Camera,
  Projector,
  Smartphone,
  ShoppingCart,
  Phone,
  Waves,
  Droplet,
  Shirt,
  Sun,
  Fan
} from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import applianceDatabase from "../../engine/applianceDatabase.js";

// Map appliance IDs to Lucide icons
const APPLIANCE_ICONS = {
  // Cooling
  chest_freezer: Refrigerator,
  refrigerator: Refrigerator,
  ac_1hp: Snowflake,
  "ac_1.5hp": Snowflake,
  ac_2hp: Snowflake,
  ceiling_fan: Fan,
  water_dispenser: Droplets,
  // Cooking
  industrial_cooker: UtensilsCrossed,
  microwave: Microwave,
  deep_fryer: Flame,
  blender: Blender,
  electric_kettle: Coffee,
  toaster: Flame,
  // Lighting
  led_bulb: Lightbulb,
  fluorescent_tube: Lamp,
  incandescent_bulb: Lamp,
  // Electronics
  tv_32inch: Tv,
  tv_43inch: Tv,
  desktop_pc: Monitor,
  laptop: Laptop,
  laser_printer: Printer,
  cctv_system: Camera,
  projector: Projector,
  phone_charger: Smartphone,
  pos_terminal: ShoppingCart,
  intercom: Phone,
  // Heavy Duty
  washing_machine: Waves,
  water_pump: Droplet,
  electric_iron: Shirt,
  solar_panel_system: Sun,
};

const CATEGORY_CONFIG = {
  all: { label: "All", icon: null },
  cooling: { label: "Cooling", icon: Snowflake, color: "cyan" },
  cooking: { label: "Cooking", icon: Flame, color: "amber" },
  lighting: { label: "Lighting", icon: Lightbulb, color: "yellow" },
  electronics: { label: "Electronics", icon: Monitor, color: "purple" },
  heavy_duty: { label: "Heavy Duty", icon: Settings, color: "zinc" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

export default function ApplianceSelector({ selected, onUpdate }) {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const categories = ["all", ...new Set(applianceDatabase.map((a) => a.category))];

  const filtered = applianceDatabase.filter((app) => {
    const matchesCategory = category === "all" || app.category === category;
    const matchesSearch = app.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAppliance = (app) => {
    const existing = selected.find((a) => a.id === app.id);
    if (existing) {
      onUpdate(selected.filter((a) => a.id !== app.id));
    } else {
      onUpdate([...selected, { id: app.id, quantity: 1, hoursPerDay: 8 }]);
    }
  };

  const updateAppliance = (id, field, value) => {
    onUpdate(
      selected.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const removeAppliance = (id) => {
    onUpdate(selected.filter((a) => a.id !== id));
  };

  const getApplianceInfo = (id) => applianceDatabase.find((a) => a.id === id);

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search appliances..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {categories.map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const Icon = config.icon;
            const isActive = category === cat;
            
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                    : "bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Appliance Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
      >
        {filtered.map((app) => {
          const isSelected = selected.find((a) => a.id === app.id);
          const categoryConfig = CATEGORY_CONFIG[app.category];
          const IconComponent = APPLIANCE_ICONS[app.id] || Settings;
          
          return (
            <motion.div key={app.id} variants={itemVariants}>
              <Card
                onClick={() => toggleAppliance(app)}
                className={`cursor-pointer transition-all duration-200 h-full ${
                  isSelected
                    ? "bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/50"
                    : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800"
                }`}
              >
                <div className="p-4 flex flex-col items-center text-center gap-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected 
                      ? `bg-${categoryConfig.color}-500/20 text-${categoryConfig.color}-400` 
                      : "bg-zinc-700/50 text-zinc-400"
                  }`}>
                    {isSelected ? <Check className="w-5 h-5" /> : <IconComponent className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${isSelected ? "text-white" : "text-zinc-300"}`}>
                      {app.label}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">{app.wattage}W</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Selected Appliances */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-zinc-800/50 border-zinc-700/50">
              <div className="p-4 border-b border-zinc-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="success">{selected.length} selected</Badge>
                  <span className="text-sm text-zinc-400">Configure quantities and usage hours</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {selected.map((app) => {
                  const info = getApplianceInfo(app.id);
                  if (!info) return null;
                  
                  const IconComponent = APPLIANCE_ICONS[app.id] || Settings;
                  const categoryConfig = CATEGORY_CONFIG[info.category];
                  
                  return (
                    <motion.div
                      key={app.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-4 p-3 bg-zinc-900/50 rounded-lg"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-${categoryConfig.color}-500/10 flex items-center justify-center text-${categoryConfig.color}-400`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{info.label}</div>
                        <div className="text-xs text-zinc-500">{info.wattage}W • {info.category.replace("_", " ")}</div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">Qty:</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateAppliance(app.id, "quantity", Math.max(1, app.quantity - 1));
                              }}
                              className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 transition-colors active:scale-95"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              min="1"
                              max="50"
                              value={app.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                updateAppliance(app.id, "quantity", Math.min(50, Math.max(1, val)));
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-12 h-8 bg-zinc-800 border border-zinc-700 rounded text-center text-sm text-white focus:border-emerald-500/50 focus:outline-none"
                              aria-label="Quantity"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateAppliance(app.id, "quantity", Math.min(50, app.quantity + 1));
                              }}
                              className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 transition-colors active:scale-95"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">Hours/day:</span>
                          <input
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min="1"
                            max="24"
                            value={app.hoursPerDay}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              updateAppliance(app.id, "hoursPerDay", Math.min(24, Math.max(1, val)));
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-14 h-8 bg-zinc-800 border border-zinc-700 rounded text-center text-sm text-white focus:border-emerald-500/50 focus:outline-none"
                            aria-label="Hours per day"
                          />
                        </div>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAppliance(app.id);
                          }}
                          className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}