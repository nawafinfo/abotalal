
CREATE TABLE public.portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'social_media',
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active portfolio items" ON public.portfolio_items
  FOR SELECT USING ((is_active = true) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage portfolio items" ON public.portfolio_items
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
