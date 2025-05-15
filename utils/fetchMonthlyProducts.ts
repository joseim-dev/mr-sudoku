import { supabase } from "@/utils/supabase";

export async function fetchMonthlyProducts(platform: string) {
  const { data, error } = await supabase
    .from("monthly_product")
    .select("*")
    .eq("platform", platform);

  console.log("fetchMonthlyProducts", data);

  if (error) {
    console.error("데이터 불러오기 실패:", error);
    return null;
  }

  return data;
}
