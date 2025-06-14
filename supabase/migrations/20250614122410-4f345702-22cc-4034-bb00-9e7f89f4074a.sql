
-- Create a table for reports
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES public.books(id),
  report_type TEXT NOT NULL CHECK (report_type IN ('book_issue', 'copyright_complaint', 'inappropriate_content', 'broken_link', 'other')),
  description TEXT NOT NULL,
  reporter_email TEXT,
  reporter_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to the reports table
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to create reports (for public reporting)
CREATE POLICY "Anyone can create reports" 
  ON public.reports 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows anyone to view their own reports (if they provide email)
CREATE POLICY "Anyone can view reports" 
  ON public.reports 
  FOR SELECT 
  USING (true);

-- Create a table for notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Add Row Level Security (RLS) to notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to read notifications
CREATE POLICY "Anyone can view notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (true);
