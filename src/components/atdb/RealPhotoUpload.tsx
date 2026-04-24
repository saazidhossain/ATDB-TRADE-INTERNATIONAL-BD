// Runtime "Upload real photo" widget — uploads an image to Supabase Storage,
// registers it in the `real_photos` table, and notifies the parent
// so the gallery and the generated PDF refresh immediately.

import { useRef, useState } from "react";
import { Camera, Loader2, Check, X } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useI18n, useFontClass } from "@/lib/i18n";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

const fileSchema = z.object({
  size: z.number().max(MAX_BYTES, "Image must be 8 MB or smaller"),
  type: z.string().refine((t) => ACCEPTED.includes(t), "Use JPG, PNG, or WebP"),
});

interface Props {
  equipmentId: string;
  /** Called with the new public URL after a successful upload. */
  onUploaded: (publicUrl: string) => void;
}

type Status =
  | { state: "idle" }
  | { state: "uploading" }
  | { state: "success"; url: string }
  | { state: "error"; message: string };

export function RealPhotoUpload({ equipmentId, onUploaded }: Props) {
  const { t } = useI18n();
  const fontClass = useFontClass();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const handleFile = async (file: File) => {
    const parsed = fileSchema.safeParse({ size: file.size, type: file.type });
    if (!parsed.success) {
      setStatus({ state: "error", message: parsed.error.issues[0]?.message ?? "Invalid file" });
      return;
    }

    setStatus({ state: "uploading" });

    try {
      const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${equipmentId.toUpperCase()}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("equipment-real-photos")
        .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
      if (uploadErr) throw uploadErr;

      const { data: pub } = supabase.storage.from("equipment-real-photos").getPublicUrl(path);
      const publicUrl = pub.publicUrl;

      const { error: insertErr } = await supabase.from("real_photos").insert({
        equipment_id: equipmentId.toUpperCase(),
        storage_path: path,
        public_url: publicUrl,
        sort_index: Date.now(),
      });
      if (insertErr) throw insertErr;

      setStatus({ state: "success", url: publicUrl });
      onUploaded(publicUrl);
    } catch (err) {
      setStatus({
        state: "error",
        message: err instanceof Error ? err.message : "Upload failed",
      });
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = ""; // allow re-uploading same file
  };

  const busy = status.state === "uploading";

  return (
    <div className="card-glass mt-4 rounded-md border border-border bg-card/60 p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-gradient-iron text-white">
          <Camera className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`font-display text-[11px] font-bold uppercase tracking-[0.16em] text-iron ${fontClass}`}>
            {t("realPhoto.upload.title")}
          </p>
          <p className={`mt-1 text-xs leading-relaxed text-muted-foreground ${fontClass}`}>
            {t("realPhoto.upload.help")}
          </p>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            onChange={onChange}
            className="hidden"
            aria-label={t("realPhoto.upload.title")}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className={`mt-3 inline-flex items-center gap-2 rounded-sm border-2 border-safety bg-safety/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-safety transition-colors hover:bg-safety hover:text-white disabled:opacity-60 ${fontClass}`}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            {busy ? t("realPhoto.upload.uploading") : t("realPhoto.upload.cta")}
          </button>

          {status.state === "success" && (
            <p className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-success ${fontClass}`}>
              <Check className="h-3.5 w-3.5" />
              {t("realPhoto.upload.success")}
            </p>
          )}
          {status.state === "error" && (
            <p className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-destructive ${fontClass}`}>
              <X className="h-3.5 w-3.5" />
              {status.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
