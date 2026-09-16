
-- Create news_items table for dynamic news ticker
CREATE TABLE public.news_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active news" ON public.news_items
FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage news" ON public.news_items
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to view all profiles for user management
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to read all messages for chat management
CREATE POLICY "Admins can view all messages" ON public.messages
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can send messages" ON public.messages
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for news_items
ALTER PUBLICATION supabase_realtime ADD TABLE public.news_items;

-- Trigger for updated_at
CREATE TRIGGER update_news_items_updated_at
BEFORE UPDATE ON public.news_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default news items
INSERT INTO public.news_items (content, sort_order) VALUES
  ('مرحباً بكم في عبدالحميد داوؤد لخدمات الدعاية والإعلان', 1),
  ('خصم 20% على جميع خدمات التسويق الإلكتروني هذا الشهر', 2),
  ('نقدم خدمات جديدة في مجال حماية الحسابات والمواقع', 3),
  ('تابعونا للحصول على آخر العروض والخدمات المميزة', 4),
  ('فريق متخصص جاهز لخدمتكم على مدار الساعة', 5);
