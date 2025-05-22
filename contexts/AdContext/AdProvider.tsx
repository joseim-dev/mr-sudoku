import { gameStartAdId } from "@/constants/adIds";
import React, { useEffect } from "react";
import { useInterstitialAd } from "react-native-google-mobile-ads";
import { AdContext } from "./AdContext";

export const AdProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    isLoaded: isStartAdLoaded,
    isClosed: isStartAdClosed,
    error: startAdError,
    load: loadStartAd,
    show: showStartAd,
  } = useInterstitialAd(gameStartAdId, {
    requestNonPersonalizedAdsOnly: true,
  });

  // 광고 최초 로드
  useEffect(() => {
    loadStartAd();
  }, [loadStartAd]);

  // 광고가 닫히거나 실패하면 자동 재로드
  useEffect(() => {
    if (isStartAdClosed) {
      loadStartAd();
    }
  }, [isStartAdClosed, loadStartAd]);

  return (
    <AdContext.Provider
      value={{
        isStartAdLoaded,
        showStartAd,
        startAdError,
        isStartAdClosed,
        loadStartAd,
      }}
    >
      {children}
    </AdContext.Provider>
  );
};
