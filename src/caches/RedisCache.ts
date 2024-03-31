import { createClient } from 'redis';
import { ICache } from './ICache';

export class RedisCache implements ICache {
  private static instance: RedisCache;
  private client;

  private constructor() {
    console.log('Setting up Redis client');
    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    this.client.connect().catch(console.error);
  }

  public static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache();
    }
    return RedisCache.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = 600): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await this.client.setEx(key, ttl, stringValue);
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }
}
