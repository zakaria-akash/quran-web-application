"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  getDefaultSettings,
  mergeSettingsWithDefaults,
  saveSettingsToStorage,
  readSettingsFromStorage,
} from "@/lib/settings";

// This context carries reader settings and mutators to any client component in the app tree.
const ReaderSettingsContext = createContext(null);

// This hook gives consumer components typed access to settings state and actions.
export function useReaderSettings() {
  const contextValue = useContext(ReaderSettingsContext);
  if (!contextValue) {
    throw new Error("useReaderSettings must be used inside ReaderSettingsProvider.");
  }
  return contextValue;
}

// This provider centralizes settings persistence and applies CSS variables for global styling.
export function ReaderSettingsProvider({ children }) {
  // Lazy initialization hydrates from localStorage in browser and uses defaults on server.
  const [settings, setSettings] = useState(() => {
    if (typeof window === "undefined") {
      return getDefaultSettings();
    }
    return readSettingsFromStorage();
  });

  // This callback merges updates, persists them, and updates state in one path.
  const updateSettings = useCallback((partialUpdate) => {
    const mergedSettings = mergeSettingsWithDefaults({ ...settings, ...partialUpdate });
    const persistedSettings = saveSettingsToStorage(mergedSettings);
    setSettings(persistedSettings);
  }, [settings]);

  // This callback restores defaults and persists the reset immediately.
  const resetSettings = useCallback(() => {
    const defaultSettings = getDefaultSettings();
    const persistedDefaults = saveSettingsToStorage(defaultSettings);
    setSettings(persistedDefaults);
  }, []);

  // These CSS variables apply reader preferences to all descendant pages consistently.
  const cssVariables = useMemo(() => ({
    "--qwa-arabic-font-family": `"${settings.arabicFontFamily}", serif`,
    "--qwa-arabic-font-size": `${settings.arabicFontSize}px`,
    "--qwa-translation-font-size": `${settings.translationFontSize}px`,
  }), [settings]);

  // The memoized context value prevents avoidable downstream re-renders.
  const contextValue = useMemo(() => ({
    settings,
    updateSettings,
    resetSettings,
  }), [resetSettings, settings, updateSettings]);

  return (
    <ReaderSettingsContext.Provider value={contextValue}>
      {/* This wrapper injects CSS variables so server and client views share typography settings. */}
      <div className="reader-settings-scope" style={cssVariables}>
        {children}
      </div>
    </ReaderSettingsContext.Provider>
  );
}
