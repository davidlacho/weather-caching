import { ICache } from "./ICache";

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export class InMemoryCache implements ICache {
  // private constructor, use getInstance() instead to get the singleton instance
  private constructor() {}

  private static instance: InMemoryCache;

  // Disabling @typescript-eslint/no-explicit-any here because the
  // InMemoryCache should be flexible enough to handle values
  // of any type.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache: Record<string, CacheEntry<any>> = {};

  public static getInstance(): InMemoryCache {
    // Singleton pattern so we only have one instance of InMemoryCache
    if (!InMemoryCache.instance) {
      InMemoryCache.instance = new InMemoryCache();
    }
    return InMemoryCache.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache[key];

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      delete this.cache[key];
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl: number = 600): Promise<void> {
    const expiresAt = Date.now() + ttl * 1000;
    this.cache[key] = { value, expiresAt };
  }
}
