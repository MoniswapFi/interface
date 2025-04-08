import { useEffect, useState } from "react";

export function useTimeInMotion() {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return currentTime;
}

export function useSetInterval(cb: () => void, ms: number = 1000) {
  return useEffect(() => {
    const interval = setInterval(cb, ms);
    return () => {
      clearInterval(interval);
    };
  }, [cb, ms]);
}
