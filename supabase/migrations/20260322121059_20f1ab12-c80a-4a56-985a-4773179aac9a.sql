
-- Allow admins to insert notifications
CREATE POLICY "Admins can insert notifications" ON public.notifications FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
