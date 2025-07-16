import { LocalStorageKey } from "@/constants/localStorage";
import { useState, useEffect } from "react";

/**
 * A React hook for syncing state with localStorage.
 *
 * @template T The type of the value to store.
 * @param {string} key The key under which the value is stored in localStorage.
 * @param {T} initialValue The initial value to use if there is no value in localStorage.
 * @returns {[T, (value: T | ((prevValue: T) => T)) => void, () => void]} A tuple containing the current value, a setter function, and a remover function.
 */
export function useLocalStorage<T>(
  key: LocalStorageKey,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      // If we're server-side, return initial value directly
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Listen for changes to the key in localStorage from other tabs/windows
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Error parsing localStorage key "${key}" on storage event:`, error);
        }
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialValue]);

  /**
   * Setter function that also writes to localStorage.
   *
   * @param {T | ((prevValue: T) => T)} value The new value or a function receiving the current value.
   */
  const setValue = (value: T | ((prevValue: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  /**
   * Remover function that clears the key from localStorage and resets to initialValue.
   */
  const removeValue = () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}
