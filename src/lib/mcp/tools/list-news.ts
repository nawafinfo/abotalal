import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

declare const process: { env: Record<string, string | undefined> };

export default defineTool({
  name: "list_news",
  title: "List news ticker items",
  description: "List active news ticker announcements published on ابوطلال للدعاية والإعلان والتسويق الإلكتروني.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!);
    const { data, error } = await supabase
      .from("news_items")
      .select("id,content,sort_order,created_at")
      .eq("is_active", true)
      .order("sort_order")
      .limit(limit ?? 20);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { news: data ?? [] },
    };
  },
});