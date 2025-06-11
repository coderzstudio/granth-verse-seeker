
-- 1. Fix Auth RLS Initialization Plan Warnings by using SELECT subqueries
-- This prevents re-evaluation of auth functions for every row

-- Drop existing policies on books table (if any exist)
DROP POLICY IF EXISTS "Users can view their own books" ON public.books;
DROP POLICY IF EXISTS "Users can create their own books" ON public.books;
DROP POLICY IF EXISTS "Users can update their own books" ON public.books;
DROP POLICY IF EXISTS "Users can delete their own books" ON public.books;
DROP POLICY IF EXISTS "Allow public read access to books" ON public.books;

-- Create optimized policies for books table
CREATE POLICY "Allow public read access to books" 
  ON public.books 
  FOR SELECT 
  TO public 
  USING (true);

-- Drop existing policies on categories table
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
DROP POLICY IF EXISTS "Only authenticated users can modify categories" ON public.categories;
DROP POLICY IF EXISTS "Users can view categories" ON public.categories;
DROP POLICY IF EXISTS "Users can create categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete categories" ON public.categories;

-- Create consolidated policy for categories (public read access)
CREATE POLICY "Allow public read access to categories" 
  ON public.categories 
  FOR SELECT 
  TO public 
  USING (true);

-- Drop existing policies on user_reading_activity table
DROP POLICY IF EXISTS "Users can view their own reading activity" ON public.user_reading_activity;
DROP POLICY IF EXISTS "Users can create their own reading activity" ON public.user_reading_activity;
DROP POLICY IF EXISTS "Users can update their own reading activity" ON public.user_reading_activity;
DROP POLICY IF EXISTS "Users can delete their own reading activity" ON public.user_reading_activity;

-- Create optimized policies for user_reading_activity using SELECT subqueries
CREATE POLICY "Users can view their own reading activity" 
  ON public.user_reading_activity 
  FOR SELECT 
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own reading activity" 
  ON public.user_reading_activity 
  FOR INSERT 
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own reading activity" 
  ON public.user_reading_activity 
  FOR UPDATE 
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own reading activity" 
  ON public.user_reading_activity 
  FOR DELETE 
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- 2. Create missing foreign key index for performance
CREATE INDEX IF NOT EXISTS idx_user_reading_activity_book_id 
  ON public.user_reading_activity (book_id);

-- 3. Remove unused indexes on books table
-- Note: Remove these only if you're certain they're not needed
DROP INDEX IF EXISTS idx_books_title;
DROP INDEX IF EXISTS idx_books_description;
DROP INDEX IF EXISTS idx_books_tags;
DROP INDEX IF EXISTS idx_books_open_count;

-- 4. Create useful indexes for common query patterns
-- Index for category filtering (used in your Books page)
CREATE INDEX IF NOT EXISTS idx_books_category 
  ON public.books (category);

-- Index for search functionality (title and author)
CREATE INDEX IF NOT EXISTS idx_books_title_search 
  ON public.books USING gin (to_tsvector('english', title));

CREATE INDEX IF NOT EXISTS idx_books_author_search 
  ON public.books USING gin (to_tsvector('english', author));

-- Composite index for user reading activity queries
CREATE INDEX IF NOT EXISTS idx_user_reading_activity_user_book 
  ON public.user_reading_activity (user_id, book_id);

-- Index for ordering books by creation date
CREATE INDEX IF NOT EXISTS idx_books_created_at 
  ON public.books (created_at DESC);
