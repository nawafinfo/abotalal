import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

declare const process: { env: Record<string, string | undefined> };

export default defineTool({
  name: "list_services",
  title: "List services",
  description: "List active marketing/advertising services offered by ابوطلال للدعاية والإعلان والتسويق الإلكتروني.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).optional().describe("Max services to return (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!);
    const { data, error } = await supabase
      .from("services")
      .select("id,name,description,category,price,icon,is_active")
      .eq("is_active", true)
      .limit(limit ?? 50);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { services: data ?? [] },
    };
  },
});