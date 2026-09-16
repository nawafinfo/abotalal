
-- Hero slides table
CREATE TABLE public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  gradient text NOT NULL DEFAULT 'from-primary/20 to-accent/20',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active slides" ON public.hero_slides
  FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage slides" ON public.hero_slides
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_hero_slides_updated_at
  BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default slides
INSERT INTO public.hero_slides (title, description, gradient, sort_order) VALUES
  ('خدمات الدعاية والإعلان', 'حملات إعلانية مبتكرة تصل لجمهورك المستهدف', 'from-primary/20 to-accent/20', 1),
  ('التسويق الإلكتروني', 'استراتيجيات تسويقية متكاملة لنمو أعمالك', 'from-blue-600/20 to-cyan-500/20', 2),
  ('إدارة الصفحات والمواقع', 'إدارة احترافية لتواجدك الرقمي', 'from-violet-600/20 to-purple-500/20', 3),
  ('خدمات المونتاج', 'إنتاج فيديوهات احترافية عالية الجودة', 'from-rose-600/20 to-pink-500/20', 4);

-- Storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for hero_slides
ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_slides;
