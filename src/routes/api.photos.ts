import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
} as const;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });

const DeleteSchema = z.object({
  storagePath: z.string().min(1).max(500),
  photoId: z.string().uuid(),
});

const PatchSchema = z.object({
  photoId: z.string().uuid(),
  caption: z.string().max(300).optional(),
  conditionNotes: z.string().max(1000).optional(),
  uploaderName: z.string().max(100).optional(),
  sortIndex: z.number().int().optional(),
});

export const Route = createFileRoute("/api/photos")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),

      GET: async ({ request }: { request: Request }) => {
        const url = new URL(request.url);
        const equipmentId = url.searchParams.get("equipmentId");
        if (!equipmentId) return json({ ok: false, error: "missing_equipment_id" }, 400);

        const { data, error } = await supabaseAdmin
          .from("real_photos")
          .select("id, equipment_id, storage_path, public_url, caption, condition_notes, uploader_name, sort_index, created_at")
          .eq("equipment_id", equipmentId.toUpperCase())
          .order("sort_index", { ascending: true })
          .order("created_at", { ascending: true });

        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, photos: data ?? [] });
      },

      DELETE: async ({ request }: { request: Request }) => {
        let body: unknown;
        try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }

        const parsed = DeleteSchema.safeParse(body);
        if (!parsed.success) return json({ ok: false, error: "validation_error", issues: parsed.error.flatten() }, 400);

        const { storagePath, photoId } = parsed.data;

        // Delete from storage
        const { error: storageError } = await supabaseAdmin.storage
          .from("equipment-real-photos")
          .remove([storagePath]);

        // Delete from registry (non-fatal if not found)
        await supabaseAdmin.from("real_photos").delete().eq("id", photoId);

        if (storageError) {
          console.error("storage delete error", storageError);
          return json({ ok: false, error: "storage_delete_failed" }, 500);
        }

        return json({ ok: true });
      },

      PATCH: async ({ request }: { request: Request }) => {
        let body: unknown;
        try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }

        const parsed = PatchSchema.safeParse(body);
        if (!parsed.success) return json({ ok: false, error: "validation_error", issues: parsed.error.flatten() }, 400);

        const { photoId, caption, conditionNotes, uploaderName, sortIndex } = parsed.data;

        const updates: Record<string, unknown> = {};
        if (caption !== undefined) updates.caption = caption;
        if (conditionNotes !== undefined) updates.condition_notes = conditionNotes;
        if (uploaderName !== undefined) updates.uploader_name = uploaderName;
        if (sortIndex !== undefined) updates.sort_index = sortIndex;

        const { error } = await supabaseAdmin
          .from("real_photos")
          .update(updates)
          .eq("id", photoId);

        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true });
      },
    },
  },
});
