import { createContext, useContext, useReducer } from "react";

const initialState = {
  currentStep: 1,
  auditData: {
    businessType: "",
    location: "",
    size: "",
    operatingHours: 8,
    generator: {
      capacityKVA: 5,
      hoursPerDay: 8,
      fuelType: "diesel",
    },
    appliances: [],
    gridHoursPerDay: 4,
    monthlyFuelSpend: 0,
  },
  auditResults: null,
};

function auditReducer(state, action) {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "UPDATE_AUDIT_DATA":
      return {
        ...state,
        auditData: { ...state.auditData, ...action.payload },
      };
    case "UPDATE_GENERATOR":
      return {
        ...state,
        auditData: {
          ...state.auditData,
          generator: { ...state.auditData.generator, ...action.payload },
        },
      };
    case "SET_APPLIANCES":
      return {
        ...state,
        auditData: { ...state.auditData, appliances: action.payload },
      };
    case "SET_RESULTS":
      return { ...state, auditResults: action.payload };
    case "LOAD_SAVED_AUDIT":
      return {
        ...state,
        auditData: action.payload.audit_data,
        auditResults: action.payload.results,
        currentStep: 4,
      };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

const AuditContext = createContext(null);

export function AuditProvider({ children }) {
  const [state, dispatch] = useReducer(auditReducer, initialState);

  const setStep = (step) => dispatch({ type: "SET_STEP", payload: step });
  const updateAuditData = (data) =>
    dispatch({ type: "UPDATE_AUDIT_DATA", payload: data });
  const updateGenerator = (data) =>
    dispatch({ type: "UPDATE_GENERATOR", payload: data });
  const setAppliances = (apps) =>
    dispatch({ type: "SET_APPLIANCES", payload: apps });
  const setResults = (results) =>
    dispatch({ type: "SET_RESULTS", payload: results });
  const loadSavedAudit = (audit) =>
    dispatch({ type: "LOAD_SAVED_AUDIT", payload: audit });
  const reset = () => dispatch({ type: "RESET" });

  return (
    <AuditContext.Provider
      value={{
        ...state,
        setStep,
        updateAuditData,
        updateGenerator,
        setAppliances,
        setResults,
        loadSavedAudit,
        reset,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error("useAudit must be used within AuditProvider");
  return ctx;
}
