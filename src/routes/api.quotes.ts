import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
} as const;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });

const QuoteSchema = z.object({
  equipment_ids: z.array(z.string().min(1).max(50)).min(1).max(20),
  project_location: z.string().trim().max(200).optional().or(z.literal("")),
  start_date: z.string().max(30).optional().or(z.literal("")),
  end_date: z.string().max(30).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  source: z.string().max(60).optional(),
});

// Simple in-memory rate limit
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

function checkRate(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) {
    hits.set(ip, arr);
    return false;
  }
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 500) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t > WINDOW_MS)) hits.delete(k);
    }
  }
  return true;
}

async function hashIp(ip: string): Promise<string> {
  try {
    const buf = new TextEncoder().encode(ip + "|atdb-quotes");
    const digest = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(digest))
      .slice(0, 16)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "unknown";
  }
}

export const Route = createFileRoute("/api/quotes")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),

      POST: async ({ request }: { request: Request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          "unknown";

        if (!checkRate(ip)) {
          return json({ ok: false, error: "rate_limited", message: "Too many requests." }, 429);
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ ok: false, error: "invalid_json" }, 400);
        }

        const parsed = QuoteSchema.safeParse(body);
        if (!parsed.success)
          return json(
            { ok: false, error: "validation_error", issues: parsed.error.flatten() },
            400,
          );

        const ipHash = await hashIp(ip);

        const { data, error } = await supabaseAdmin
          .from("quote_requests")
          .insert({
            equipment_ids: parsed.data.equipment_ids,
            project_location: parsed.data.project_location || null,
            start_date: parsed.data.start_date || null,
            end_date: parsed.data.end_date || null,
            notes: parsed.data.notes || null,
            source: parsed.data.source || "cart",
            ip_hash: ipHash,
          })
          .select("reference")
          .single();

        if (error) {
          console.error("quote_requests insert error", error);
          return json({ ok: false, error: "db_error" }, 500);
        }

        return json({ ok: true, reference: data.reference });
      },
    },
  },
});
