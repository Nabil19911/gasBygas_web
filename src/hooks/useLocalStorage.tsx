import { useState } from "react";

interface IUseLocalStorageProps<T> {
  key: string;
  initialValue: T;
}

const useLocalStorage = <T extends unknown>({
  key,
  initialValue,
}: IUseLocalStorageProps<T>) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Save a value to sessionStorage
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  // Remove the key from sessionStorage
  const removeValue = () => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  };

  return { storedValue, setValue, removeValue };
};

export default useLocalStorage;
