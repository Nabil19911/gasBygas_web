import { useState } from "react";

interface IUseSessionStorageProps<T> {
  key: string;
  initialValue: T;
}

const useSessionStorage = <T extends unknown>({
  key,
  initialValue,
}: IUseSessionStorageProps<T>) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
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
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  // Remove the key from sessionStorage
  const removeValue = () => {
    try {
      sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  };

  return { storedValue, setValue, removeValue };
};

export default useSessionStorage;
