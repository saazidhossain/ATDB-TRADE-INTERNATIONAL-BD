// Enhanced "Upload real photo" widget with metadata capture.
// Step 1: Drag-drop / click file selection with preview.
// Step 2: Optional metadata form (uploader name, caption, condition notes).
// Uploads to Supabase Storage, registers in `real_photos`, then patches metadata.

import { useCallback, useRef, useState } from "react";
import { Camera, Loader2, Check, X, Upload, User, FileText, Info } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useI18n, useFontClass } from "@/lib/i18n";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_EXT = ".jpg,.jpeg,.png,.webp";

const fileSchema = z.object({
  size: z.number().max(MAX_BYTES, "Image must be 8 MB or smaller"),
  type: z.string().refine((t) => ACCEPTED.includes(t), "Use JPG, PNG, or WebP"),
});

interface Props {
  equipmentId: string;
  onUploaded: (publicUrl: string) => void;
}

type UploadStep = "idle" | "preview" | "uploading" | "success" | "error";

interface UploadState {
  step: UploadStep;
  file: File | null;
  previewUrl: string | null;
  errorMessage: string | null;
  successUrl: string | null;
  photoId: string | null;
}

export function RealPhotoUpload({ equipmentId, onUploaded }: Props) {
  const { t } = useI18n();
  const fontClass = useFontClass();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>({
    step: "idle",
    file: null,
    previewUrl: null,
    errorMessage: null,
    successUrl: null,
    photoId: null,
  });
  const [uploaderName, setUploaderName] = useState("");
  const [caption, setCaption] = useState("");
  const [conditionNotes, setConditionNotes] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const selectFile = useCallback((file: File) => {
    const parsed = fileSchema.safeParse({ size: file.size, type: file.type });
    if (!parsed.success) {
      setState((s) => ({
        ...s,
        step: "error",
        errorMessage: parsed.error.issues[0]?.message ?? "Invalid file",
      }));
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setState({
      step: "preview",
      file,
      previewUrl,
      errorMessage: null,
      successUrl: null,
      photoId: null,
    });
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) selectFile(f);
    e.target.value = "";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) selectFile(f);
  };

  const handleUpload = async () => {
    if (!state.file) return;
    setState((s) => ({ ...s, step: "uploading" }));

    try {
      const ext =
        state.file.name
          .split(".")
          .pop()
          ?.toLowerCase()
          .replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${equipmentId.toUpperCase()}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("equipment-real-photos")
        .upload(path, state.file, { contentType: state.file.type, cacheControl: "31536000" });
      if (uploadErr) throw uploadErr;

      const { data: pub } = supabase.storage.from("equipment-real-photos").getPublicUrl(path);
      const publicUrl = pub.publicUrl;

      const { data: inserted, error: insertErr } = await supabase
        .from("real_photos")
        .insert({
          equipment_id: equipmentId.toUpperCase(),
          storage_path: path,
          public_url: publicUrl,
          sort_index: Date.now(),
          caption: caption.trim() || null,
          condition_notes: conditionNotes.trim() || null,
          uploader_name: uploaderName.trim() || null,
        })
        .select("id")
        .single();
      if (insertErr) throw insertErr;

      if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);

      setState({
        step: "success",
        file: null,
        previewUrl: null,
        errorMessage: null,
        successUrl: publicUrl,
        photoId: inserted?.id ?? null,
      });
      onUploaded(publicUrl);
    } catch (err) {
      setState((s) => ({
        ...s,
        step: "error",
        errorMessage: err instanceof Error ? err.message : "Upload failed",
      }));
    }
  };

  const reset = () => {
    if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
    setState({
      step: "idle",
      file: null,
      previewUrl: null,
      errorMessage: null,
      successUrl: null,
      photoId: null,
    });
    setUploaderName("");
    setCaption("");
    setConditionNotes("");
  };

  return (
    <div className="card-glass mt-4 rounded-md border border-border bg-card/60 p-4">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-gradient-iron text-white">
          <Camera className="h-4 w-4" />
        </div>
        <div>
          <p
            className={`font-display text-[11px] font-bold uppercase tracking-[0.16em] text-iron ${fontClass}`}
          >
            {t("realPhoto.upload.title")}
          </p>
          <p className={`text-xs text-muted-foreground ${fontClass}`}>
            {t("realPhoto.upload.help")}
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXT}
        onChange={onFileChange}
        className="hidden"
        aria-label={t("realPhoto.upload.title")}
      />

      {/* STEP: idle — drop zone */}
      {(state.step === "idle" || state.step === "error") && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          aria-label={t("realPhoto.upload.cta")}
          className={`mt-2 flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed p-6 text-center transition-colors ${
            isDragging
              ? "border-safety bg-safety/5"
              : "border-border hover:border-safety/60 hover:bg-safety/3"
          }`}
        >
          <Upload className={`h-6 w-6 ${isDragging ? "text-safety" : "text-muted-foreground"}`} />
          <div>
            <p className={`text-sm font-semibold text-iron ${fontClass}`}>
              {t("realPhoto.upload.cta")}
            </p>
            <p className={`mt-0.5 text-xs text-muted-foreground ${fontClass}`}>
              JPG · PNG · WebP · max 8 MB
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {state.step === "error" && state.errorMessage && (
        <p
          className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-destructive ${fontClass}`}
        >
          <X className="h-3.5 w-3.5" />
          {state.errorMessage}
        </p>
      )}

      {/* STEP: preview + metadata form */}
      {state.step === "preview" && state.previewUrl && (
        <div className="mt-3 space-y-3">
          <div className="relative aspect-video overflow-hidden rounded-sm border border-border bg-muted">
            <img src={state.previewUrl} alt="Preview" className="h-full w-full object-contain" />
            <button
              type="button"
              onClick={reset}
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-iron-deep/70 text-white backdrop-blur hover:bg-destructive"
              aria-label="Remove photo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Metadata fields */}
          <div className="space-y-2">
            <div className="relative">
              <User className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("realPhoto.meta.uploader")}
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                maxLength={100}
                className={`w-full rounded-sm border border-border bg-background pl-8 pr-3 py-2 text-sm text-iron placeholder:text-muted-foreground focus:border-safety focus:outline-none focus:ring-1 focus:ring-safety ${fontClass}`}
              />
            </div>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("realPhoto.meta.caption")}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={300}
                className={`w-full rounded-sm border border-border bg-background pl-8 pr-3 py-2 text-sm text-iron placeholder:text-muted-foreground focus:border-safety focus:outline-none focus:ring-1 focus:ring-safety ${fontClass}`}
              />
            </div>
            <div className="relative">
              <Info className="pointer-events-none absolute left-2.5 top-3 h-3.5 w-3.5 text-muted-foreground" />
              <textarea
                placeholder={t("realPhoto.meta.conditionNotes")}
                value={conditionNotes}
                onChange={(e) => setConditionNotes(e.target.value)}
                maxLength={1000}
                rows={2}
                className={`w-full resize-none rounded-sm border border-border bg-background pl-8 pr-3 py-2 text-sm text-iron placeholder:text-muted-foreground focus:border-safety focus:outline-none focus:ring-1 focus:ring-safety ${fontClass}`}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUpload}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-sm border-2 border-safety bg-safety/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-safety transition-colors hover:bg-safety hover:text-white ${fontClass}`}
            >
              <Upload className="h-3.5 w-3.5" />
              {t("realPhoto.upload.cta")}
            </button>
            <button
              type="button"
              onClick={reset}
              className={`inline-flex items-center justify-center gap-1.5 rounded-sm border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted ${fontClass}`}
            >
              {t("common.cancel") || "Cancel"}
            </button>
          </div>
        </div>
      )}

      {/* STEP: uploading */}
      {state.step === "uploading" && (
        <div className="mt-3 flex items-center justify-center gap-3 rounded-md border border-border bg-muted/40 p-4">
          <Loader2 className="h-5 w-5 animate-spin text-safety" />
          <p className={`text-sm font-semibold text-iron ${fontClass}`}>
            {t("realPhoto.upload.uploading")}
          </p>
        </div>
      )}

      {/* STEP: success */}
      {state.step === "success" && state.successUrl && (
        <div className="mt-3 space-y-3">
          <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/5 p-3">
            <Check className="h-4 w-4 text-success" />
            <p className={`text-sm font-semibold text-success ${fontClass}`}>
              {t("realPhoto.upload.success")}
            </p>
          </div>
          <img
            src={state.successUrl}
            alt="Uploaded photo"
            className="aspect-video w-full rounded-sm border border-border object-contain bg-muted"
          />
          <button
            type="button"
            onClick={reset}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold text-safety hover:text-safety-deep ${fontClass}`}
          >
            <Camera className="h-3.5 w-3.5" /> {t("realPhoto.upload.another") || "Upload another"}
          </button>
        </div>
      )}
    </div>
  );
}
