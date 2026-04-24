-- Extended metadata for uploaded equipment photos (caption, condition, uploader)
ALTER TABLE public.real_photos
  ADD COLUMN IF NOT EXISTS caption       text,
  ADD COLUMN IF NOT EXISTS condition_notes text,
  ADD COLUMN IF NOT EXISTS uploader_name text;

-- Quote request tracking (from cart/drawer submissions)
CREATE TABLE public.quote_requests (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference         text NOT NULL UNIQUE DEFAULT 'QR-' || upper(substring(gen_random_uuid()::text, 1, 8)),
  equipment_ids     text[] NOT NULL,
  project_location  text,
  start_date        text,
  end_date          text,
  notes             text,
  source            text NOT NULL DEFAULT 'cart',
  ip_hash           text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a quote request"
  ON public.quote_requests FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_quote_requests_created_at ON public.quote_requests(created_at DESC);

-- Allow deleting and updating own photos (for admin use via service role)
CREATE POLICY "Anyone can delete a real photo"
  ON public.real_photos FOR DELETE
  USING (true);

CREATE POLICY "Anyone can update a real photo"
  ON public.real_photos FOR UPDATE
  USING (true)
  WITH CHECK (true);
