/**
 * Hook for persisting form data to localStorage
 * Enables offline form completion and recovery from page refreshes
 */

import { useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "ecoaudit_form_draft";
const TIMESTAMP_KEY = "ecoaudit_form_timestamp";
const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Save form data to localStorage
 */
export function saveFormDraft(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.warn("Failed to save form draft:", error);
  }
}

/**
 * Load form data from localStorage
 * Returns null if data is expired or doesn't exist
 */
export function loadFormDraft() {
  try {
    const timestamp = localStorage.getItem(TIMESTAMP_KEY);
    if (!timestamp) return null;

    const age = Date.now() - parseInt(timestamp, 10);
    if (age > MAX_AGE) {
      clearFormDraft();
      return null;
    }

    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn("Failed to load form draft:", error);
    return null;
  }
}

/**
 * Clear saved form data
 */
export function clearFormDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TIMESTAMP_KEY);
  } catch (error) {
    console.warn("Failed to clear form draft:", error);
  }
}

/**
 * Check if a valid form draft exists
 */
export function hasFormDraft() {
  try {
    const timestamp = localStorage.getItem(TIMESTAMP_KEY);
    if (!timestamp) return false;

    const age = Date.now() - parseInt(timestamp, 10);
    return age <= MAX_AGE;
  } catch {
    return false;
  }
}

/**
 * Hook to automatically persist form data
 * @param {Object} formData - The form data to persist
 * @param {number} debounceMs - Debounce time in milliseconds
 */
export function useFormPersistence(formData, debounceMs = 1000) {
  const timeoutRef = useRef(null);
  const lastSavedRef = useRef(null);

  useEffect(() => {
    // Skip saving if formData is null (e.g., while draft dialog is showing)
    if (formData === null || formData === undefined) {
      return;
    }

    // Debounce the save operation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // Only save if data has changed
      const dataString = JSON.stringify(formData);
      if (dataString !== lastSavedRef.current) {
        saveFormDraft(formData);
        lastSavedRef.current = dataString;
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, debounceMs]);

  // Save immediately on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveFormDraft(formData);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData]);
}

/**
 * Hook to restore form data on mount
 * @param {Function} restoreCallback - Function to call with restored data
 */
export function useFormRestore(restoreCallback) {
  useEffect(() => {
    const draft = loadFormDraft();
    if (draft) {
      restoreCallback(draft);
    }
  }, [restoreCallback]);
}

/**
 * Get the age of the current draft in minutes
 */
export function getDraftAge() {
  try {
    const timestamp = localStorage.getItem(TIMESTAMP_KEY);
    if (!timestamp) return null;

    const age = Date.now() - parseInt(timestamp, 10);
    return Math.round(age / (60 * 1000)); // Convert to minutes
  } catch {
    return null;
  }
}
