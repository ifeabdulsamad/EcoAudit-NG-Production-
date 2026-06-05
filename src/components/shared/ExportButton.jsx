import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Loader2, Check, Lock, X } from "lucide-react";
import { Button } from "../ui/button";
import { exportPdf } from "../../utils/pdfExport.js";
import { useFeatureGate } from "../../hooks/useFeatureGate.js";

export default function ExportButton({ businessName, onUpgradeRequired }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const { canAccess } = useFeatureGate();

  const canExport = canAccess('pdf_export');

  const handleExport = async () => {
    if (!canExport) {
      onUpgradeRequired?.();
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(false);
    try {
      await exportPdf("dashboard-content", businessName);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Export failed:", err);
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={loading}
      className="relative overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center"
          >
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Generating PDF...
          </motion.div>
        ) : success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center text-emerald-400"
          >
            <Check className="mr-2 w-4 h-4" />
            Downloaded!
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center text-red-400"
          >
            <X className="mr-2 w-4 h-4" />
            Export Failed
          </motion.div>
        ) : !canExport ? (
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center"
          >
            <Lock className="mr-2 w-4 h-4" />
            Export PDF
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center"
          >
            <Download className="mr-2 w-4 h-4" />
            Export PDF
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}