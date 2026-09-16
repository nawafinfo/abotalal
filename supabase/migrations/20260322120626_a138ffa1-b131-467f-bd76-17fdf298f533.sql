
-- WiFi Products table
CREATE TABLE public.wifi_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'systems',
  type text,
  price numeric DEFAULT 0,
  discount_percent numeric DEFAULT 0,
  is_free boolean DEFAULT false,
  image_url text,
  logo_url text,
  preview_url text,
  download_url text,
  code_content text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- WiFi Product Images
CREATE TABLE public.wifi_product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.wifi_products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- WiFi Orders
CREATE TABLE public.wifi_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  product_id uuid REFERENCES public.wifi_products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  section text NOT NULL,
  customer_name text NOT NULL,
  country text DEFAULT 'اليمن',
  country_code text DEFAULT '+967',
  customer_phone text NOT NULL,
  order_type text NOT NULL DEFAULT 'purchase',
  details text,
  title text,
  price numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- WiFi Posts (Problems & Solutions)
CREATE TABLE public.wifi_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  content text,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.wifi_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wifi_product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wifi_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wifi_posts ENABLE ROW LEVEL SECURITY;

-- wifi_products policies
CREATE POLICY "Anyone can view active wifi products" ON public.wifi_products FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage wifi products" ON public.wifi_products FOR ALL USING (has_role(auth.uid(), 'admin'));

-- wifi_product_images policies
CREATE POLICY "Anyone can view wifi product images" ON public.wifi_product_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage wifi product images" ON public.wifi_product_images FOR ALL USING (has_role(auth.uid(), 'admin'));

-- wifi_orders policies
CREATE POLICY "Authenticated users can create wifi orders" ON public.wifi_orders FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view their own wifi orders" ON public.wifi_orders FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all wifi orders" ON public.wifi_orders FOR ALL USING (has_role(auth.uid(), 'admin'));

-- wifi_posts policies
CREATE POLICY "Anyone can view active wifi posts" ON public.wifi_posts FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage wifi posts" ON public.wifi_posts FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Triggers
CREATE TRIGGER update_wifi_products_updated_at BEFORE UPDATE ON public.wifi_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wifi_orders_updated_at BEFORE UPDATE ON public.wifi_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wifi_posts_updated_at BEFORE UPDATE ON public.wifi_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
