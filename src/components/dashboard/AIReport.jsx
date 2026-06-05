import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  WifiOff,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { generateAuditReport } from "../../api/geminiAudit.js";
import { generateLocalReport } from "../../utils/fallbackReport.js";

function parseInlineMarkdown(text) {
  const parts = [];
  let key = 0;
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(
        <strong key={key++} className="text-purple-400">
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      parts.push(
        <em key={key++} className="text-purple-300">
          {match[3]}
        </em>,
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function SkeletonLine({ width = "100%", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="h-4 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 rounded animate-pulse"
      style={{ width }}
    />
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 text-zinc-500">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
        className="w-2 h-2 bg-emerald-500 rounded-full"
      />
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        className="w-2 h-2 bg-emerald-500 rounded-full"
      />
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        className="w-2 h-2 bg-emerald-500 rounded-full"
      />
    </div>
  );
}

export default function AIReport({ auditResults }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchReport() {
      setLoading(true);
      setError(false);
      setIsOfflineMode(false);

      try {
        const text = await generateAuditReport(auditResults);
        if (cancelled) return;
        if (text) {
          setReport(text);
        } else {
          // Fallback to local report if API returns empty
          const fallbackText = generateLocalReport(auditResults);
          setReport(fallbackText);
          setIsOfflineMode(true);
        }
      } catch (err) {
        if (!cancelled) {
          // Use local fallback on any error
          const fallbackText = generateLocalReport(auditResults);
          setReport(fallbackText);
          setIsOfflineMode(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchReport();
    return () => {
      cancelled = true;
    };
  }, [auditResults]);

  const handleCopy = () => {
    if (report) {
      navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRetry = async () => {
    setLoading(true);
    setError(false);
    setIsOfflineMode(false);
    setReport(null);

    try {
      const text = await generateAuditReport(auditResults);
      if (text) {
        setReport(text);
      } else {
        const fallbackText = generateLocalReport(auditResults);
        setReport(fallbackText);
        setIsOfflineMode(true);
      }
    } catch {
      const fallbackText = generateLocalReport(auditResults);
      setReport(fallbackText);
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card-hover overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOfflineMode ? "bg-amber-500/10" : "bg-purple-500/10"}`}
            >
              {isOfflineMode ? (
                <WifiOff className="w-4 h-4 text-amber-400" />
              ) : (
                <Brain className="w-4 h-4 text-purple-400" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">
                {isOfflineMode ? "Audit Report" : "AI Audit Report"}
              </CardTitle>
              <CardDescription>
                {isOfflineMode ? "Generated locally" : "Generated by AI"}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!loading && report && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-zinc-400 hover:text-white"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            )}
            {isOfflineMode ? (
              <Badge
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 text-amber-400"
              >
                <WifiOff className="w-3 h-3 mr-1" />
                Offline Mode
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-purple-500/30 bg-purple-500/10 text-purple-400"
              >
                <img
                  src="/favicon.svg"
                  alt="EcoAudit NG"
                  className="w-4 h-4 "
                />
                {/* <Sparkles className="w-3 h-3 mr-1" /> */}
                AI-Powered
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 py-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Analyzing your audit data...
                  </p>
                  <TypingIndicator />
                </div>
              </div>
              <SkeletonLine width="85%" delay={0} />
              <SkeletonLine width="100%" delay={0.1} />
              <SkeletonLine width="90%" delay={0.2} />
              <SkeletonLine width="75%" delay={0.3} />
              <SkeletonLine width="95%" delay={0.4} />
              <SkeletonLine width="80%" delay={0.5} />
            </motion.div>
          )}

          {report && !loading && (
            <motion.div
              key="report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="py-4"
            >
              {/* Offline mode notice */}
              {isOfflineMode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3"
                >
                  <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-300">
                      Showing locally-generated report. Connect to the internet
                      for AI-enhanced insights.
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRetry}
                      className="mt-2 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 h-auto py-1 px-2"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Try AI Report
                    </Button>
                  </div>
                </motion.div>
              )}

              <div className="prose prose-invert prose-zinc max-w-none">
                {report
                  .split("\n")
                  .filter(Boolean)
                  .map((line, i) => {
                    const isHeading =
                      line.startsWith("**") && line.endsWith("**");
                    const isNairaLine = line.includes("₦");
                    const isDivider = line.startsWith("---");

                    if (isDivider) {
                      return <hr key={i} className="border-zinc-800 my-4" />;
                    }

                    if (isHeading) {
                      return (
                        <motion.h4
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`text-lg font-semibold mt-6 mb-3 first:mt-0 ${isOfflineMode ? "text-emerald-400" : "text-purple-400"}`}
                        >
                          {line.replace(/\*\*/g, "")}
                        </motion.h4>
                      );
                    }

                    return (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className={`text-zinc-300 leading-relaxed mb-3 ${isNairaLine ? "text-emerald-400 font-medium" : ""}`}
                      >
                        {parseInlineMarkdown(line)}
                      </motion.p>
                    );
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
