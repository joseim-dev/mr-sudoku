import * as SecureStore from "expo-secure-store";

// 저장: 광고 제거 상태 true로 설정
// ✅ 이름은 그대로지만, 내부에서 토글 처리
export const saveAdsRemoved = async () => {
  const current = await SecureStore.getItemAsync("adsRemoved");
  const newValue = current === "true" ? "false" : "true";
  console.log("Saving adsRemoved:", newValue);
  await SecureStore.setItemAsync("adsRemoved", newValue);
};
// 불러오기: 광고 제거 상태 확인
export const isAdsRemoved = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync("adsRemoved");
  return value === "true";
};

// 삭제 (선택사항)
export const removeAdsFlag = async () => {
  await SecureStore.deleteItemAsync("adsRemoved");
};
