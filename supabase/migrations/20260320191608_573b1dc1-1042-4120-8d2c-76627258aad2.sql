
-- Packages table
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'gold',
  description TEXT,
  features TEXT[] DEFAULT '{}',
  price NUMERIC NOT NULL DEFAULT 0,
  discount_percent NUMERIC DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Package subscriptions table
CREATE TABLE public.package_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  package_name TEXT NOT NULL,
  package_type TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT '+967',
  user_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_subscriptions ENABLE ROW LEVEL SECURITY;

-- Packages policies
CREATE POLICY "Anyone can view active packages" ON public.packages FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage packages" ON public.packages FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Package subscriptions policies
CREATE POLICY "Authenticated users can create subscriptions" ON public.package_subscriptions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view their own subscriptions" ON public.package_subscriptions FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all subscriptions" ON public.package_subscriptions FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.packages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.package_subscriptions;

-- Update trigger
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_package_subscriptions_updated_at BEFORE UPDATE ON public.package_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
