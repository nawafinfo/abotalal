CREATE TABLE public.blog_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  icon text DEFAULT 'Shield',
  color text DEFAULT '#22c55e',
  gradient_from text DEFAULT '#0ea5e9',
  gradient_to text DEFAULT '#22c55e',
  parent_id uuid REFERENCES public.blog_sections(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_sections TO authenticated;
GRANT SELECT ON public.blog_sections TO anon;
GRANT ALL ON public.blog_sections TO service_role;
ALTER TABLE public.blog_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_sections_public_read" ON public.blog_sections FOR SELECT USING (true);
CREATE POLICY "blog_sections_admin_all" ON public.blog_sections FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES public.blog_sections(id) ON DELETE SET NULL,
  title text NOT NULL,
  summary text,
  image_url text,
  content text,
  views_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT SELECT ON public.blog_posts TO anon;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_posts_public_read" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "blog_posts_admin_all" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  user_name text NOT NULL,
  content text NOT NULL,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_comments TO authenticated;
GRANT ALL ON public.blog_comments TO service_role;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_comments_read" ON public.blog_comments FOR SELECT TO authenticated USING (is_visible OR user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "blog_comments_insert_own" ON public.blog_comments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "blog_comments_update_own" ON public.blog_comments FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "blog_comments_delete_own" ON public.blog_comments FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "blog_comments_admin_all" ON public.blog_comments FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER update_blog_sections_updated_at BEFORE UPDATE ON public.blog_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_blog_posts_section ON public.blog_posts(section_id);
CREATE INDEX idx_blog_sections_parent ON public.blog_sections(parent_id);
CREATE INDEX idx_blog_comments_post ON public.blog_comments(post_id);