
-- Referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referred_email text NOT NULL,
  referred_user_id uuid,
  status text NOT NULL DEFAULT 'pending',
  points_awarded integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authenticated users can create referrals" ON public.referrals FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage all referrals" ON public.referrals FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- User points table
CREATE TABLE IF NOT EXISTS public.user_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  points integer NOT NULL DEFAULT 0,
  total_earned integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own points" ON public.user_points FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert points" ON public.user_points FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage all points" ON public.user_points FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can update own points" ON public.user_points FOR UPDATE USING (auth.uid() = user_id);

-- Points history
CREATE TABLE IF NOT EXISTS public.points_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own points history" ON public.points_history FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage points history" ON public.points_history FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert points history" ON public.points_history FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Add image_url column to hero_slides for thumbnail
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS image_url text;

-- Add media columns to messages
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS media_url text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS media_type text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS file_name text;

-- Create chat-media storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-media', 'chat-media', true) ON CONFLICT DO NOTHING;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.referrals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_points;
