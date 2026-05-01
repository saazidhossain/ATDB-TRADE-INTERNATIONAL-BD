// POST /api/contact — public contact/quote form endpoint.
// • Zod-validated payload
// • Best-effort in-memory IP rate limit (5 req / 10 min per IP).
//   NOTE: Worker isolates are short-lived, so this is advisory only.
// • Persists to public.contact_leads via the service-role client.

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  project_location: z.string().trim().max(200).optional().or(z.literal("")),
  equipment_interest: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(2000),
  source: z.string().trim().max(60).optional(),
  // Honeypot — must stay empty
  website: z.string().max(0).optional(),
});

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

// --- Best-effort IP throttle (in-memory, per-isolate) ---
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
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
  // Lightweight cleanup
  if (hits.size > 500) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t > WINDOW_MS)) hits.delete(k);
    }
  }
  return true;
}

async function hashIp(ip: string): Promise<string> {
  try {
    const buf = new TextEncoder().encode(ip + "|atdb");
    const digest = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(digest))
      .slice(0, 16)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "unknown";
  }
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),

      POST: async ({ request }: { request: Request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          "unknown";

        if (!checkRate(ip)) {
          return json(
            {
              ok: false,
              error: "rate_limited",
              message: "Too many requests. Please try again in a few minutes.",
            },
            429,
          );
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ ok: false, error: "invalid_json" }, 400);
        }

        const parsed = ContactSchema.safeParse(body);
        if (!parsed.success) {
          return json(
            { ok: false, error: "validation_error", issues: parsed.error.flatten() },
            400,
          );
        }

        // Honeypot trigger — silently succeed
        if (parsed.data.website && parsed.data.website.length > 0) {
          return json({ ok: true });
        }

        const ipHash = await hashIp(ip);
        const ua = request.headers.get("user-agent")?.slice(0, 500) ?? null;

        const { error } = await supabaseAdmin.from("contact_leads").insert({
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone || null,
          company: parsed.data.company || null,
          project_location: parsed.data.project_location || null,
          equipment_interest: parsed.data.equipment_interest || null,
          message: parsed.data.message,
          source: parsed.data.source || "contact_form",
          ip_hash: ipHash,
          user_agent: ua,
        });

        if (error) {
          console.error("contact_leads insert error", error);
          return json({ ok: false, error: "db_error" }, 500);
        }

        return json({ ok: true });
      },
    },
  },
});
