import { InMemoryCache } from "../src/caches/InMemoryCache";

describe("InMemoryCache", () => {
  let cache: InMemoryCache;

  beforeEach(() => {
    cache = InMemoryCache.getInstance();
  });

  it("returns null for missing keys", async () => {
    const value = await cache.get("nonExistentKey");
    expect(value).toBeNull();
  });

  it("stores and retrieves a value", async () => {
    await cache.set("testKey", "testValue", 10);
    const value = await cache.get("testKey");
    expect(value).toBe("testValue");
  });

  it("obeys the singleton pattern", () => {
    const cacheInstance1 = InMemoryCache.getInstance();
    const cacheInstance2 = InMemoryCache.getInstance();

    expect(cacheInstance1).toBe(cacheInstance2);
  });

  it("updates an existing cache entry before it expires", async () => {
    await cache.set("updatableKey", "initialValue", 10);
    await cache.set("updatableKey", "updatedValue", 10);

    const value = await cache.get("updatableKey");
    expect(value).toBe("updatedValue");
  });
});
