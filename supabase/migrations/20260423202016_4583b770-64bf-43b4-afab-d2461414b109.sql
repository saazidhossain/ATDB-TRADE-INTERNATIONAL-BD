
-- Public storage bucket for runtime-uploaded "real / current condition" equipment photos.
INSERT INTO storage.buckets (id, name, public)
VALUES ('equipment-real-photos', 'equipment-real-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view (bucket is public).
CREATE POLICY "Real photos are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'equipment-real-photos');

-- Anyone can upload (mirrors public lead-submission pattern; uploads are size-limited client side).
CREATE POLICY "Anyone can upload a real photo"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'equipment-real-photos');

-- Tracking table: maps storage paths to equipment IDs and preserves upload order.
CREATE TABLE public.real_photos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id  text NOT NULL,
  storage_path  text NOT NULL UNIQUE,
  public_url    text NOT NULL,
  sort_index    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX real_photos_equipment_id_idx
  ON public.real_photos (equipment_id, sort_index, created_at);

ALTER TABLE public.real_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Real photos are publicly readable"
  ON public.real_photos FOR SELECT
  USING (true);

CREATE POLICY "Anyone can register a real photo"
  ON public.real_photos FOR INSERT
  WITH CHECK (true);
