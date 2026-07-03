import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "prepedge-theme";

/** @typedef {"light" | "dark" | "system"} ThemePreference */

const ThemeContext = createContext(null);

/**
 * @returns {{ theme: ThemePreference, setTheme: (t: ThemePreference) => void, resolvedTheme: "light"|"dark", toggleTheme: () => void }}
 */
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

function resolveDark(theme) {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * ThemeProvider — light / dark / system with localStorage persistence.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => /** @type {ThemePreference} */ (localStorage.getItem(STORAGE_KEY) || "system")
  );
  const [resolvedTheme, setResolvedTheme] = useState(
    /** @type {"light"|"dark"} */ ("light")
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const isDark = resolveDark(theme);
      document.documentElement.classList.toggle("dark", isDark);
      setResolvedTheme(isDark ? "dark" : "light");
    };

    apply();
    localStorage.setItem(STORAGE_KEY, theme);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => {
      if (t === "system") return resolveDark("system") ? "light" : "dark";
      return t === "dark" ? "light" : "dark";
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
