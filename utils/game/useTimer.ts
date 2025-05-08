import { useEffect } from "react";

export const useTimer = (onTick: () => void) => {
  useEffect(() => {
    const timer = setInterval(onTick, 1000);
    return () => clearInterval(timer);
  }, [onTick]);
};
