import { createClient } from "@supabase/supabase-js";
const sb = createClient(
  "https://gzbtmvzidmrnbcgyonlu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6YnRtdnppZG1ybmJjZ3lvbmx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU4NDcwNywiZXhwIjoyMDk4MTYwNzA3fQ.Lyux_w1TegynR20Q-uci5rNbs0ojeNWCMlzWuQDCAb4",
  { auth: { persistSession: false } },
);

const tables = process.argv.slice(2);
(async () => {
  for (const table of tables) {
    const { error } = await sb.from(table).select("*").limit(1);
    if (!error) {
      console.log(`OK ${table}: EXISTS`);
    } else {
      const msg = error.message || "";
      // PostgREST returns "relation \"public.foo\" does not exist" when the table is missing.
      // It also returns this if the service role lacks SELECT.
      const missing = /does not exist|Could not find the table|schema "public" does not exist/i.test(msg);
      console.log(`${missing ? "MISSING" : "EXISTS?"} ${table}: ${msg.replace(/\s+/g, " ").trim()}`);
    }
  }
})();
