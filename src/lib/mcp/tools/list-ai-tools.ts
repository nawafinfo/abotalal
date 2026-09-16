import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

declare const process: { env: Record<string, string | undefined> };

export default defineTool({
  name: "list_ai_tools",
  title: "List AI tools",
  description: "List active AI tools and models curated on ابوطلال للدعاية والإعلان والتسويق الإلكتروني.",
  inputSchema: {
    category: z.string().optional().describe("Optional category filter (chat, image, video, audio, text, code, other)."),
    featured_only: z.boolean().optional().describe("If true, return only featured tools."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, featured_only }) => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!);
    let query = supabase
      .from("ai_tools")
      .select("id,name,description,category,tool_url,is_featured,is_active,sort_order")
      .eq("is_active", true)
      .order("sort_order");
    if (category) query = query.eq("category", category);
    if (featured_only) query = query.eq("is_featured", true);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { tools: data ?? [] },
    };
  },
});