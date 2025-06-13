export interface CachedBook {
  id: string;
  title: string;
  image_url?: string;
  category: string;
  short_description?: string;
  created_at: string;
  updated_at: string;
}

export interface BookCacheData {
  lastViewedBooks: {
    currentBook: string;
    viewportBooks: string[];
  };
  timestamp: string;
  books: Record<string, CachedBook>;
}

const CACHE_KEY = 'bookCache_v1';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHED_BOOKS = 20;

export class BookCacheManager {
  private static isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private static compressBookData(book: any): CachedBook {
    return {
      id: book.id,
      title: book.title,
      image_url: book.image_url,
      category: book.category,
      short_description: book.short_description,
      created_at: book.created_at || new Date().toISOString(),
      updated_at: book.updated_at || new Date().toISOString()
    };
  }

  static getCacheData(): BookCacheData | null {
    if (!this.isStorageAvailable()) return null;

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const data: BookCacheData = JSON.parse(cached);
      const now = new Date().getTime();
      const cacheTime = new Date(data.timestamp).getTime();

      // Check if cache is stale
      if (now - cacheTime > CACHE_DURATION) {
        this.clearCache();
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error reading cache:', error);
      this.clearCache();
      return null;
    }
  }

  static updateCache(currentBook: string, viewportBooks: string[], allBooks: any[]): void {
    if (!this.isStorageAvailable()) return;

    try {
      const existingCache = this.getCacheData();
      const now = new Date().toISOString();

      // Prepare books data with LRU eviction
      const booksToCache = allBooks.slice(0, MAX_CACHED_BOOKS);
      const compressedBooks: Record<string, CachedBook> = {};

      booksToCache.forEach(book => {
        compressedBooks[book.id] = this.compressBookData(book);
      });

      const cacheData: BookCacheData = {
        lastViewedBooks: {
          currentBook,
          viewportBooks: viewportBooks.slice(0, 10) // Limit viewport books
        },
        timestamp: now,
        books: compressedBooks
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error updating cache:', error);
      // Handle storage quota exceeded
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.clearCache();
      }
    }
  }

  static getCachedBooks(bookIds: string[]): CachedBook[] {
    const cache = this.getCacheData();
    if (!cache) return [];

    return bookIds
      .map(id => cache.books[id])
      .filter(Boolean);
  }

  static clearCache(): void {
    if (!this.isStorageAvailable()) return;
    
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  static isCacheValid(): boolean {
    const cache = this.getCacheData();
    return cache !== null;
  }
}
