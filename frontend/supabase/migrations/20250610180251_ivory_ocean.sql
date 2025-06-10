/*
  # Add Video Reports Table

  1. New Tables
    - `video_reports`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `video_id` (uuid, foreign key to videos)
      - `reason` (text, report reason)
      - `description` (text, optional description)
      - `status` (text, report status)
      - `admin_notes` (text, admin notes)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `video_reports` table
    - Add policies for users to create reports and admins to manage them
*/

CREATE TABLE IF NOT EXISTS video_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK (reason IN ('copyright', 'inappropriate', 'spam', 'misleading')),
  description text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

ALTER TABLE video_reports ENABLE ROW LEVEL SECURITY;

-- Policy for users to create reports
CREATE POLICY "Users can create reports"
  ON video_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to view their own reports
CREATE POLICY "Users can view own reports"
  ON video_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for admins to view all reports (you'll need to implement admin role checking)
CREATE POLICY "Admins can view all reports"
  ON video_reports
  FOR SELECT
  TO authenticated
  USING (true); -- Replace with proper admin check

-- Policy for admins to update reports
CREATE POLICY "Admins can update reports"
  ON video_reports
  FOR UPDATE
  TO authenticated
  USING (true); -- Replace with proper admin check

-- Create index for better performance
CREATE INDEX idx_video_reports_user_id ON video_reports(user_id);
CREATE INDEX idx_video_reports_video_id ON video_reports(video_id);
CREATE INDEX idx_video_reports_status ON video_reports(status);
CREATE INDEX idx_video_reports_created_at ON video_reports(created_at DESC);