import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

declare const process: { env: Record<string, string | undefined> };

export default defineTool({
  name: "list_packages",
  title: "List packages",
  description: "List active promotional packages (Gold, Diamond, Silver) with pricing and features.",
  inputSchema: {
    type: z.string().optional().describe("Filter by package type (e.g. 'gold', 'diamond', 'silver')."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ type }) => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!);
    let query = supabase
      .from("packages")
      .select("id,name,type,description,features,price,discount_percent,is_active")
      .eq("is_active", true)
      .order("sort_order");
    if (type) query = query.eq("type", type);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { packages: data ?? [] },
    };
  },
});