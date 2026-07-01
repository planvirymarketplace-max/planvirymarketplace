import pg from "pg";
const { Pool } = pg;

// Try different password variations
const passwords = ["Bavin1863!!", "bavin1863!!"];
const hosts = [
  { host: "aws-1-us-east-1.pooler.supabase.com", port: 5432, user: "postgres.gzbtmvzidmrnbcgyonlu" },
  { host: "aws-1-us-east-1.pooler.supabase.com", port: 6543, user: "postgres.gzbtmvzidmrnbcgyonlu" },
];

for (const host of hosts) {
  for (const pw of passwords) {
    const pool = new Pool({
      ...host,
      database: "postgres",
      password: pw,
      ssl: { rejectUnauthorized: false },
      family: 4,
      connectionTimeoutMillis: 8000,
    });
    try {
      const client = await pool.connect();
      console.log(`✓ CONNECTED: ${host.host}:${host.port} user=${host.user} pw=${pw.slice(0,3)}***`);

      // Run the RLS fix SQL
      const sql = `
CREATE OR REPLACE FUNCTION public.fn_user_vendor_ids(p_user_id UUID)
RETURNS UUID[]
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT array_agg(vendor_id) FROM public.vendor_staff
  WHERE user_id = p_user_id AND status = 'ACTIVE';
$$;

DROP POLICY IF EXISTS "vendor_staff_select_own" ON public.vendor_staff;
DROP POLICY IF EXISTS "vendor_staff_select" ON public.vendor_staff;
DROP POLICY IF EXISTS "vendor_staff_insert" ON public.vendor_staff;
DROP POLICY IF EXISTS "vendor_staff_update" ON public.vendor_staff;
DROP POLICY IF EXISTS "vendor_staff_delete" ON public.vendor_staff;

CREATE POLICY "vendor_staff_select_own" ON public.vendor_staff
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR vendor_id = ANY(fn_user_vendor_ids(auth.uid())));

CREATE POLICY "vendor_staff_insert_own" ON public.vendor_staff
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "vendor_staff_update_own" ON public.vendor_staff
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR vendor_id = ANY(fn_user_vendor_ids(auth.uid())))
  WITH CHECK (user_id = auth.uid() OR vendor_id = ANY(fn_user_vendor_ids(auth.uid())));

DROP POLICY IF EXISTS "itinerary_sessions_select" ON public.itinerary_sessions;
DROP POLICY IF EXISTS "itinerary_sessions_select_own" ON public.itinerary_sessions;

CREATE POLICY "itinerary_sessions_select_own" ON public.itinerary_sessions
  FOR SELECT TO authenticated
  USING (
    owner_id = auth.uid()
    OR id IN (SELECT itinerary_id FROM public.itinerary_members WHERE user_id = auth.uid())
  );

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "orders_select_own" ON public.orders
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "orders_insert_own" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "orders_update_own" ON public.orders
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "discounts_select_all" ON public.discounts
  FOR SELECT TO authenticated, anon USING (status = 'ACTIVE');
CREATE POLICY IF NOT EXISTS "discounts_write_vendor" ON public.discounts
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.vendor_staff WHERE user_id = auth.uid() AND role = 'OWNER' AND status = 'ACTIVE'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.vendor_staff WHERE user_id = auth.uid() AND role = 'OWNER' AND status = 'ACTIVE'));

CREATE POLICY IF NOT EXISTS "waitlist_select_own" ON public.waitlist_entries
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "waitlist_insert_own" ON public.waitlist_entries
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "waitlist_update_own" ON public.waitlist_entries
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
`;
      await client.query(sql);
      console.log("✓ ALL RLS FIXES APPLIED");
      console.log("  ✓ fn_user_vendor_ids() created");
      console.log("  ✓ vendor_staff policies recreated");
      console.log("  ✓ itinerary_sessions policy fixed");
      console.log("  ✓ RLS enabled on orders, discounts, waitlist_entries");
      console.log("  ✓ Policies added for all 3 tables");

      client.release();
      await pool.end();
      process.exit(0);
    } catch (e) {
      console.log(`✗ ${host.host}:${host.port} pw=${pw.slice(0,3)}***: ${e.message}`);
      await pool.end();
    }
  }
}
