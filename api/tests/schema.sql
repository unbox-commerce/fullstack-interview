CREATE TYPE video_status AS ENUM ('live', 'under_review', 'removed');

CREATE TABLE organizations (
  organization_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE users (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(organization_id),
  email text NOT NULL UNIQUE,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE creators (
  creator_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(organization_id),
  username text NOT NULL,
  display_name text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE videos (
  video_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(organization_id),
  creator_id uuid NOT NULL REFERENCES creators(creator_id),
  title text NOT NULL,
  status video_status NOT NULL DEFAULT 'live',
  thumbnail_key text NOT NULL,
  posted_at timestamp NOT NULL
);

CREATE TABLE video_day_metrics (
  video_id uuid NOT NULL REFERENCES videos(video_id),
  organization_id uuid NOT NULL REFERENCES organizations(organization_id),
  date date NOT NULL,
  views integer NOT NULL DEFAULT 0
);
