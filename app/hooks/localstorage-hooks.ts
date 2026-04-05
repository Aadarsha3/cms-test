import { useState, useEffect, Dispatch, SetStateAction } from "react";

export type ThemeName = "light" | "dark" | "system";

/**
 * A custom hook that syncs state with window.localStorage.
 * It handles JSON serialization/deserialization and window storage events.
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  // Get from local storage then parse stored json or return initialValue
  const readValue = (): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Dispatch a custom event so other instances of this hook in other components can sync
        window.dispatchEvent(new Event("local-storage"));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // Listen for changes in the same window (custom event)
    window.addEventListener("local-storage", handleStorageChange);
    // Listen for changes in other windows/tabs (native event)
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("local-storage", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return [storedValue, setValue];
}

/**
 * Specifically manages the theme preference in localStorage.
 */
export function useThemeStorage(): [ThemeName, Dispatch<SetStateAction<ThemeName>>] {
  return useLocalStorage<ThemeName>("app-theme", "system");
}
