
CREATE TABLE public.apps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'social',
  icon text,
  icon_url text,
  download_url text,
  version text DEFAULT '1.0',
  size text DEFAULT '10 MB',
  rating numeric DEFAULT 4.5,
  downloads_count text DEFAULT '1K+',
  color text DEFAULT 'from-blue-500 to-blue-700',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage apps" ON public.apps FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view active apps" ON public.apps FOR SELECT USING ((is_active = true) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_apps_updated_at BEFORE UPDATE ON public.apps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE public.app_storage (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id uuid REFERENCES public.apps(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.app_storage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage app storage" ON public.app_storage FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view app storage" ON public.app_storage FOR SELECT USING (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('app-files', 'app-files', true);
