# Roadside Support - API & Database Setup Guide

## 1. Google Maps API

> Required for: Location autocomplete and map preview

### Steps to Get API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name it "Roadside Support" and click Create

3. **Enable Required APIs**
   - Go to "APIs & Services" → "Library"
   - Search and enable these 3 APIs:
     - **Maps JavaScript API**
     - **Places API**
     - **Geocoding API**

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated key

5. **Restrict the API Key** (Important for security)
   - Click on your API key
   - Under "Application restrictions" → Select "HTTP referrers"
   - Add your domains:
     - `http://localhost:3000/*` (for development)
     - `https://your-domain.com/*` (for production)
   - Under "API restrictions" → Restrict to the 3 APIs enabled above

6. **Add to .env.local**
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_api_key_here
   ```

---

## 2. Resend Email API

> Required for: Sending request emails to call center

### Steps to Get API Key

1. **Sign Up at Resend**
   - Visit: https://resend.com/
   - Click "Start for free" and create an account

2. **Get API Key**
   - After login, go to "API Keys" in the sidebar
   - Click "Create API Key"
   - Give it a name like "Roadside Support Production"
   - Copy the API key (starts with `re_`)

3. **Verify Domain** (for production)
   - Go to "Domains" in the sidebar
   - Click "Add Domain"
   - Add your domain (e.g., roadsidesupport.com)
   - Add the DNS records shown to your domain registrar
   - Wait for verification (can take up to 24 hours)

4. **Add to .env.local**
   ```
   RESEND_API_KEY=re_your_api_key_here
   CALL_CENTER_EMAIL=victorokechukwu012@gmail.com
   ```

> **Note**: Free tier allows 100 emails/day, plenty for testing!

---

## 3. Supabase Database

> Required for: Storing requests (optional - app works with localStorage too)

### Steps to Set Up

1. **Create Account & Project**
   - Visit: https://supabase.com/
   - Click "Start your project" and sign up
   - Create a new organization
   - Click "New project"
   - Choose a name, password, and region

2. **Get Your Credentials**
   - Go to "Settings" → "API"
   - Copy these values:
     - **Project URL** (looks like `https://xxxxx.supabase.co`)
     - **anon public** key
     - **service_role** key (keep this secret!)

3. **Create the Database Table**
   - Go to "SQL Editor" in the sidebar
   - Click "New query"
   - Paste and run this SQL:

```sql
-- Create the requests table
CREATE TABLE requests (
  request_id UUID PRIMARY KEY,
  service_type TEXT NOT NULL,
  pickup_location JSONB NOT NULL,
  situation JSONB,
  vehicle JSONB,
  motorist JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster queries by status
CREATE INDEX idx_requests_status ON requests(status);

-- Create an index for faster queries by creation date
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);

-- Optional: Enable Row Level Security (RLS)
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Policy to allow inserts from anyone (for the public form)
CREATE POLICY "Allow public inserts" ON requests
  FOR INSERT
  WITH CHECK (true);

-- Policy to allow updates on own requests (using request_id)
CREATE POLICY "Allow updates" ON requests
  FOR UPDATE
  USING (true);

-- Policy to allow service role full access
CREATE POLICY "Service role full access" ON requests
  FOR ALL
  USING (auth.role() = 'service_role');
```

4. **Enable Realtime for the requests table**
   - Go to "Database" → "Replication" in the sidebar
   - Find your `requests` table
   - Toggle ON the "Realtime" switch
   - Or run this SQL:

```sql
-- Enable realtime for the requests table
ALTER PUBLICATION supabase_realtime ADD TABLE requests;
```

5. **Add to .env.local**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

---

## Complete .env.local Example

```env
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaSy...your-key-here

# Resend Email
RESEND_API_KEY=re_...your-key-here

# Supabase (Optional)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhb...your-service-role-key

# Application Config
CALL_CENTER_EMAIL=victorokechukwu012@gmail.com
SUPPORT_PHONE=(555) 123-4567
```

---

## Verification Checklist

- [ ] Google Maps: Location autocomplete works
- [ ] Google Maps: Map preview shows on confirmation page
- [ ] Resend: Test email arrives at call center inbox
- [ ] Supabase: Request appears in database table

---

## Troubleshooting

| Issue                       | Solution                                      |
| --------------------------- | --------------------------------------------- |
| Maps not loading            | Check API key is correct and APIs are enabled |
| "RefererNotAllowedMapError" | Add your domain to API key restrictions       |
| Emails not sending          | Verify RESEND_API_KEY is correct              |
| Emails going to spam        | Verify your domain in Resend dashboard        |
| Database not saving         | Check Supabase URL and keys are correct       |
