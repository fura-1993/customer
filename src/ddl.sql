
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  site_address TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  amount NUMERIC NOT NULL,
  periodic BOOLEAN NOT NULL DEFAULT false,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('before', 'after', 'scene', 'doc', 'video')),
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "認証済みユーザーのみ閲覧可能" ON customers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ閲覧可能" ON jobs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ閲覧可能" ON assets
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ閲覧可能" ON workers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ追加可能" ON customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ更新可能" ON customers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ削除可能" ON customers
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ追加可能" ON jobs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ更新可能" ON jobs
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ削除可能" ON jobs
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ追加可能" ON assets
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ更新可能" ON assets
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ削除可能" ON assets
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ追加可能" ON workers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ更新可能" ON workers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ削除可能" ON workers
  FOR DELETE USING (auth.role() = 'authenticated');

INSERT INTO storage.buckets (id, name, public) VALUES ('private', 'private', false);

CREATE POLICY "認証済みユーザーのみアップロード可能" ON storage.objects
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    bucket_id = 'private'
  );

CREATE POLICY "認証済みユーザーのみ閲覧可能" ON storage.objects
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    bucket_id = 'private'
  );

CREATE POLICY "認証済みユーザーのみ更新可能" ON storage.objects
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    bucket_id = 'private'
  );

CREATE POLICY "認証済みユーザーのみ削除可能" ON storage.objects
  FOR DELETE USING (
    auth.role() = 'authenticated' AND
    bucket_id = 'private'
  );
