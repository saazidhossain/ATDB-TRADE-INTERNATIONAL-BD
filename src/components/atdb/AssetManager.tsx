// AssetManager — full CRUD interface for equipment real photos.
// Shows all uploaded photos with metadata, allows editing caption/notes,
// reordering via sort index, and deletion.

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Edit3,
  Check,
  X,
  Loader2,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Image,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useFontClass } from "@/lib/i18n";

export interface ManagedPhoto {
  id: string;
  equipment_id: string;
  storage_path: string;
  public_url: string;
  caption: string | null;
  condition_notes: string | null;
  uploader_name: string | null;
  sort_index: number;
  created_at: string;
}

interface Props {
  equipmentId: string;
  /** Called after any mutation so parent can refresh gallery */
  onChanged?: () => void;
}

export function AssetManager({ equipmentId, onChanged }: Props) {
  const fontClass = useFontClass();
  const [photos, setPhotos] = useState<ManagedPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("real_photos")
        .select(
          "id, equipment_id, storage_path, public_url, caption, condition_notes, uploader_name, sort_index, created_at",
        )
        .eq("equipment_id", equipmentId.toUpperCase())
        .order("sort_index", { ascending: true })
        .order("created_at", { ascending: true });
      if (err) throw err;
      setPhotos(data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load photos");
    } finally {
      setLoading(false);
    }
  }, [equipmentId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const startEdit = (photo: ManagedPhoto) => {
    setEditingId(photo.id);
    setEditCaption(photo.caption ?? "");
    setEditNotes(photo.condition_notes ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditCaption("");
    setEditNotes("");
  };

  const saveEdit = async (photo: ManagedPhoto) => {
    setSavingId(photo.id);
    try {
      const { error: err } = await supabase
        .from("real_photos")
        .update({ caption: editCaption.trim() || null, condition_notes: editNotes.trim() || null })
        .eq("id", photo.id);
      if (err) throw err;
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id
            ? {
                ...p,
                caption: editCaption.trim() || null,
                condition_notes: editNotes.trim() || null,
              }
            : p,
        ),
      );
      cancelEdit();
      onChanged?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingId(null);
    }
  };

  const deletePhoto = async (photo: ManagedPhoto) => {
    if (!window.confirm(`Delete this photo? This cannot be undone.`)) return;
    setDeletingId(photo.id);
    try {
      await supabase.storage.from("equipment-real-photos").remove([photo.storage_path]);
      await supabase.from("real_photos").delete().eq("id", photo.id);
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      onChanged?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const movePhoto = async (photo: ManagedPhoto, direction: "up" | "down") => {
    const idx = photos.findIndex((p) => p.id === photo.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= photos.length) return;
    const swapPhoto = photos[swapIdx];
    const newPhotos = [...photos];
    // Swap sort_index values
    const tempSort = photo.sort_index;
    newPhotos[idx] = { ...photo, sort_index: swapPhoto.sort_index };
    newPhotos[swapIdx] = { ...swapPhoto, sort_index: tempSort };
    setPhotos(newPhotos);
    // Persist
    await Promise.all([
      supabase.from("real_photos").update({ sort_index: swapPhoto.sort_index }).eq("id", photo.id),
      supabase.from("real_photos").update({ sort_index: tempSort }).eq("id", swapPhoto.id),
    ]);
    onChanged?.();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-6 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className={`text-sm ${fontClass}`}>Loading assets…</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p
          className={`font-display text-[11px] font-bold uppercase tracking-[0.18em] text-iron ${fontClass}`}
        >
          Manage Photos ({photos.length})
        </p>
        <button
          type="button"
          onClick={fetchPhotos}
          className="inline-flex items-center gap-1 rounded-sm border border-border px-2 py-1 text-xs text-muted-foreground hover:text-iron"
        >
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {photos.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-6 text-center">
          <Image className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className={`mt-2 text-sm text-muted-foreground ${fontClass}`}>
            No uploaded photos yet
          </p>
        </div>
      ) : (
        <AnimatePresence>
          {photos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="rounded-md border border-border bg-card p-3 shadow-card"
            >
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm border border-border bg-muted">
                  <img
                    src={photo.public_url}
                    alt={photo.caption ?? ""}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Info / edit */}
                <div className="min-w-0 flex-1">
                  {editingId === photo.id ? (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        placeholder="Caption"
                        maxLength={300}
                        className={`w-full rounded-sm border border-border bg-background px-2 py-1 text-xs text-iron focus:border-safety focus:outline-none ${fontClass}`}
                      />
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Condition notes"
                        maxLength={1000}
                        rows={2}
                        className={`w-full resize-none rounded-sm border border-border bg-background px-2 py-1 text-xs text-iron focus:border-safety focus:outline-none ${fontClass}`}
                      />
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => saveEdit(photo)}
                          disabled={savingId === photo.id}
                          className="inline-flex items-center gap-1 rounded-sm bg-safety px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-safety-deep disabled:opacity-60"
                        >
                          {savingId === photo.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="inline-flex items-center gap-1 rounded-sm border border-border px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted"
                        >
                          <X className="h-3 w-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={`text-xs font-semibold text-iron ${fontClass}`}>
                        {photo.caption || (
                          <span className="italic text-muted-foreground">No caption</span>
                        )}
                      </p>
                      {photo.condition_notes && (
                        <p
                          className={`mt-0.5 text-xs text-muted-foreground line-clamp-2 ${fontClass}`}
                        >
                          {photo.condition_notes}
                        </p>
                      )}
                      {photo.uploader_name && (
                        <p
                          className={`mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-safety ${fontClass}`}
                        >
                          ↑ {photo.uploader_name}
                        </p>
                      )}
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {new Date(photo.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => movePhoto(photo, "up")}
                    disabled={idx === 0}
                    className="grid h-7 w-7 place-items-center rounded-sm border border-border text-muted-foreground hover:border-iron hover:text-iron disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => movePhoto(photo, "down")}
                    disabled={idx === photos.length - 1}
                    className="grid h-7 w-7 place-items-center rounded-sm border border-border text-muted-foreground hover:border-iron hover:text-iron disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(photo)}
                    className="grid h-7 w-7 place-items-center rounded-sm border border-border text-muted-foreground hover:border-safety hover:text-safety"
                    aria-label="Edit metadata"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePhoto(photo)}
                    disabled={deletingId === photo.id}
                    className="grid h-7 w-7 place-items-center rounded-sm border border-border text-muted-foreground hover:border-destructive hover:text-destructive disabled:opacity-60"
                    aria-label="Delete photo"
                  >
                    {deletingId === photo.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
