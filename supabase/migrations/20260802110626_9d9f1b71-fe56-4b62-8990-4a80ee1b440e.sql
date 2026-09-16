
CREATE POLICY "Users can confirm receipt of their orders"
ON public.orders FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND status = 'received');

CREATE POLICY "Users can confirm receipt of their wifi orders"
ON public.wifi_orders FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND status = 'received');

CREATE POLICY "Users can confirm receipt of their subscriptions"
ON public.package_subscriptions FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND status = 'received');
