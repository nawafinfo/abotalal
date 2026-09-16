CREATE TABLE public.ai_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'chat',
  tool_url TEXT,
  icon_url TEXT,
  logo_url TEXT,
  color TEXT DEFAULT 'from-purple-500 to-pink-500',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active ai tools"
ON public.ai_tools FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage ai tools"
ON public.ai_tools FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_ai_tools_updated_at
BEFORE UPDATE ON public.ai_tools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();