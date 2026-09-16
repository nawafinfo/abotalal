
-- Featured clients table
CREATE TABLE public.featured_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.featured_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage featured clients" ON public.featured_clients FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view active featured clients" ON public.featured_clients FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

-- Site settings table
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);

-- Insert default settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
  ('site_name', 'عبدالحميد للخدمات الرقمية'),
  ('site_logo_url', ''),
  ('primary_color', '40 80% 55%'),
  ('show_packages', 'true'),
  ('show_apps', 'true'),
  ('show_livestream', 'true'),
  ('show_wifi', 'true'),
  ('show_portfolio', 'true'),
  ('show_services', 'true'),
  ('show_social', 'true'),
  ('show_news', 'true'),
  ('show_featured_clients', 'true');

-- Portfolio storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

CREATE POLICY "Admins can manage portfolio files" ON storage.objects FOR ALL USING (bucket_id = 'portfolio' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view portfolio files" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
