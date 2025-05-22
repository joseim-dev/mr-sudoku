import { createContext, useContext } from "react";

type AdContextType = {
  isStartAdLoaded: boolean;
  showStartAd: () => void;
  startAdError: Error | undefined;
  isStartAdClosed: boolean;
  loadStartAd: () => void;
};

export const AdContext = createContext<AdContextType | null>(null);

export const useAd = () => {
  const context = useContext(AdContext);
  if (!context) throw new Error("useAd must be used within AdProvider");
  return context;
};
