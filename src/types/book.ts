
export interface Book {
  id: string;
  title: string;
  description?: string;
  short_description?: string;
  image_url?: string;
  pdf_drive_link?: string;
  language: string;
  category: string;
  tags?: string[];
  author?: string;
  publisher?: string;
  publication_year?: number;
  isbn?: string;
  created_at: string;
  updated_at: string;
}

export interface Language {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}
