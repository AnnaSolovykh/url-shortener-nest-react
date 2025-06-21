import { useEffect, useState } from 'react';

export function useDelayedValue<T>(value: T, delay: number): T | null {
  const [delayedValue, setDelayedValue] = useState<T | null>(null);

  useEffect(() => {
    if (value === null || value === undefined) {
      setDelayedValue(null);
      return;
    }

    const timer = setTimeout(() => {
      setDelayedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return delayedValue;
}
