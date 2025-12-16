import { useState, useEffect } from "react";

// When the user's input value changes, the component re-renders, causing the custom hook to be called again. This time, the value passed to the hook is different. Since the useEffect inside the hook depends on this value, it will re-run. As we have learned earlier, it will call the cleanup function for the previous render before re-running. Effectively, when the user keeps typing, this hook will keep clearing the previous timer and registering the new timer.

const useDebounce = value => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, 350);

    return () => {
      clearTimeout(timerId);
    };
  }, [value]);

  return debouncedValue;
};

export default useDebounce;
