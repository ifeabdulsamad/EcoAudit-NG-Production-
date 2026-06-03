import { useAudit } from "../context/AuditContext.jsx";
import { calculateAudit } from "../engine/calculationEngine.js";
import { estimateSolar } from "../engine/solarEstimator.js";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { 
  Building2, 
  Zap, 
  Wallet, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  WifiOff,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { useSwipe, useTouchDevice } from "../hooks/useSwipe.js";
import { 
  useFormPersistence, 
  loadFormDraft, 
  clearFormDraft,
  hasFormDraft,
  getDraftAge 
} from "../hooks/useFormPersistence.js";
import BusinessProfileForm from "../components/form/BusinessProfileForm";
import EnergySetupForm from "../components/form/EnergySetupForm";
import SpendConfirmation from "../components/form/SpendConfirmation";

const steps = [
  { 
    id: 1, 
    title: "Business Profile", 
    description: "Tell us about your business",
    shortTitle: "Profile",
    icon: Building2 
  },
  { 
    id: 2, 
    title: "Energy Setup", 
    description: "Add your power sources & appliances",
    shortTitle: "Energy",
    icon: Zap 
  },
  { 
    id: 3, 
    title: "Review & Confirm", 
    description: "Verify and run your audit",
    shortTitle: "Review",
    icon: Wallet 
  }
];

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

/**
 * Mobile-optimized step indicator with dots
 */
function MobileStepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        
        return (
          <div key={step.id} className="flex items-center">
            <motion.div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isActive 
                  ? "bg-emerald-500 w-6" 
                  : isCompleted
                  ? "bg-emerald-500"
                  : "bg-zinc-700"
              }`}
              animate={isActive ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${
                isCompleted ? "bg-emerald-500" : "bg-zinc-800"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Desktop step indicator with full details
 */
function DesktopStepIndicator({ currentStep }) {
  return (
    <div className="mb-8 hidden sm:block">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive 
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                      : isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-zinc-950"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500"
                  }`}
                  animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </motion.div>
                <div className="mt-3 text-center">
                  <div className={`text-sm font-medium ${isActive ? "text-white" : "text-zinc-500"}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-zinc-600 mt-0.5">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-px mx-4 bg-zinc-800 relative">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-emerald-500"
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepIndicator({ currentStep }) {
  return (
    <>
      <MobileStepIndicator currentStep={currentStep} />
      <DesktopStepIndicator currentStep={currentStep} />
    </>
  );
}

function AuditHeader() {
  return (
    <div className="text-center mb-8">
      <Badge variant="outline" className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
        <Sparkles className="w-3 h-3 mr-1" />
        Free Energy Audit
      </Badge>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
        Complete Your <span className="text-emerald-400">Audit</span>
      </h1>
      <p className="text-zinc-400 max-w-lg mx-auto">
        Answer a few questions about your business and energy usage. Takes just 3-5 minutes.
      </p>
    </div>
  );
}

/**
 * Draft recovery dialog
 */
function DraftRecoveryDialog({ onRestore, onDiscard, draftAge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <Card className="max-w-md w-full bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Resume Previous Audit?</h3>
              <p className="text-sm text-zinc-400">
                Found a draft from {draftAge} minutes ago
              </p>
            </div>
          </div>
          
          <p className="text-sm text-zinc-500 mb-6">
            You have a partially completed audit. Would you like to continue where you left off?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={onDiscard}
              className="sm:flex-1"
            >
              Start Fresh
            </Button>
            <Button 
              onClick={onRestore}
              className="sm:flex-1"
            >
              <RotateCcw className="mr-2 w-4 h-4" />
              Continue Audit
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Bottom-fixed navigation for mobile
 */
function MobileNavigation({ 
  currentStep, 
  totalSteps, 
  onBack, 
  onNext, 
  canProceed,
  isSubmitting 
}) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 p-4 sm:hidden z-40">
      <div className="flex items-center gap-3">
        {!isFirstStep && (
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1 h-12"
            disabled={isSubmitting}
          >
            <ChevronLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
        )}
        <Button 
          onClick={onNext}
          className="flex-1 h-12"
          disabled={!canProceed || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : isLastStep ? (
            <>
              Complete Audit
              <CheckCircle2 className="ml-2 w-4 h-4" />
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </div>
      <div className="mt-2 text-center">
        <span className="text-xs text-zinc-500">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
}

export default function Audit() {
  const { currentStep, setStep, auditData, setResults, updateAuditData, updateGenerator, setAppliances } = useAudit();
  const navigate = useNavigate();
  const isTouch = useTouchDevice();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftAge, setDraftAge] = useState(null);
  
  // Persist form data (disabled while draft dialog is showing to avoid overwriting saved draft)
  useFormPersistence(
    showDraftDialog ? null : { step: currentStep, data: auditData }
  );

  // Check for draft on mount
  useEffect(() => {
    if (hasFormDraft() && currentStep === 1) {
      const age = getDraftAge();
      if (age && age < 60) { // Only show if less than 60 minutes old
        setDraftAge(age);
        setShowDraftDialog(true);
      }
    }
  }, []);

  const restoreDraft = useCallback(() => {
    const draft = loadFormDraft();
    if (draft) {
      setStep(draft.step || 1);
      if (draft.data) {
        // Restore all form data
        Object.entries(draft.data).forEach(([key, value]) => {
          if (key === 'generator') {
            updateGenerator(value);
          } else if (key === 'appliances') {
            setAppliances(value);
          } else {
            updateAuditData({ [key]: value });
          }
        });
      }
    }
    setShowDraftDialog(false);
  }, [setStep, updateAuditData, updateGenerator, setAppliances]);

  const discardDraft = useCallback(() => {
    clearFormDraft();
    setShowDraftDialog(false);
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const results = calculateAudit(auditData);
    const solarData = estimateSolar(results);
    setResults({ ...results, solarData });
    clearFormDraft(); // Clear draft on successful submission
    navigate("/dashboard");
  };

  // Swipe handling
  const swipeRef = useSwipe({
    onSwipeLeft: () => {
      // Swipe left = go forward (if not on last step and can proceed)
      if (currentStep < steps.length) {
        handleNext();
      }
    },
    onSwipeRight: () => {
      // Swipe right = go back (if not on first step)
      if (currentStep > 1) {
        handlePrev();
      }
    },
    enabled: isTouch,
  });

  const canProceed = (() => {
    switch (currentStep) {
      case 1:
        return auditData.businessType && auditData.location && auditData.size;
      case 2:
        return auditData.appliances.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  })();

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-32 sm:pb-16">
      {/* Background effects */}
      <div className="fixed inset-0 gradient-mesh opacity-50 pointer-events-none" />
      <div className="fixed inset-0 mesh-bg opacity-30 pointer-events-none" />
      
      {/* Draft Recovery Dialog */}
      <AnimatePresence>
        {showDraftDialog && (
          <DraftRecoveryDialog 
            onRestore={restoreDraft}
            onDiscard={discardDraft}
            draftAge={draftAge}
          />
        )}
      </AnimatePresence>
      
      <div 
        ref={swipeRef}
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6"
      >
        <AuditHeader />
        
        <Card className="bg-zinc-900/80 backdrop-blur-xl border-zinc-800">
          <CardContent className="p-4 sm:p-8">
            <StepIndicator currentStep={currentStep} />
            
            {/* Mobile step title */}
            <div className="sm:hidden text-center mb-4">
              <div className="text-lg font-semibold text-white">
                {steps[currentStep - 1].shortTitle}
              </div>
              <div className="text-sm text-zinc-500">
                {steps[currentStep - 1].description}
              </div>
            </div>
            
            <Progress value={(currentStep / steps.length) * 100} className="h-1 mb-6" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentStep === 1 && (
                  <BusinessProfileForm 
                    onNext={handleNext} 
                    isMobile={true}
                  />
                )}
                {currentStep === 2 && (
                  <EnergySetupForm 
                    onNext={handleNext} 
                    onPrev={handlePrev}
                    isMobile={true}
                  />
                )}
                {currentStep === 3 && (
                  <SpendConfirmation 
                    onSubmit={handleSubmit}
                    onPrev={handlePrev}
                    isSubmitting={isSubmitting}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
        
        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>No signup required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Instant results</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Free PDF export</span>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        onBack={handlePrev}
        onNext={currentStep === steps.length ? handleSubmit : handleNext}
        canProceed={canProceed}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
