import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;
export const supabase = createClient(
  "https://ljgohbrmnjtyvkyimdyb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqZ29oYnJtbmp0eXZreWltZHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODQyOTMsImV4cCI6MjA2MjI2MDI5M30.D71Rgx_7nOE3c_CWfUGkP-nd5pihuUwhLXZw0JHV6Rw",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
