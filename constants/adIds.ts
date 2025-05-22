// constants/adIds.ts

import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";

export const sudokuRewardedAdId = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === "ios"
  ? "ca-app-pub-7270360511167481/7326082369"
  : "ca-app-pub-7270360511167481/6542649584";

export const wordRushRewardedAdId = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === "ios"
  ? "ca-app-pub-7270360511167481/4389222980"
  : "ca-app-pub-7270360511167481/2848076459";

export const gameStartAdId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === "ios"
  ? "ca-app-pub-7270360511167481/2466585466"
  : "ca-app-pub-7270360511167481/4229199637";
