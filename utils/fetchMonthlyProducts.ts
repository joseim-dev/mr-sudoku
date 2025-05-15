import { supabase } from "@/utils/supabase"; // 클라이언트 초기화 파일이 위치한 곳에 맞게 경로 수정

export async function fetchMonthlyProducts() {
  const { data, error } = await supabase.from("monthly_product").select("*");

  if (error) {
    console.error("데이터 불러오기 실패:", error);
    return null;
  }

  return data;
}
