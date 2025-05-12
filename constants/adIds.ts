// constants/adIds.ts

import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";

export const rewardedAdId = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === "ios"
  ? "ca-app-pub-7270360511167481/7326082369"
  : "ca-app-pub-7270360511167481/6542649584";

export const rewardedAdId2 = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === "ios"
  ? "ca-app-pub-7270360511167481/4776248133"
  : "ca-app-pub-7270360511167481/5390184168";

export const interstitialAdId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === "ios"
  ? "ca-app-pub-7270360511167481/3612345866"
  : "ca-app-pub-7270360511167481/4243789307";

export const interstitialAdId2 = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === "ios"
  ? "ca-app-pub-7270360511167481/8024387685"
  : "ca-app-pub-7270360511167481/1662175220";
