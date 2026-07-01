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
