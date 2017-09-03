export interface MemCachedValue {
  value: string;
  cachedAt: Date;
}

/** Defines the cache policy */
export interface MemCacheOption {
  /** Cache valid period in milliseconds */
  expiresIn: number;
}

export default class MemCache {
  private storage: { [key: string]: MemCachedValue } = {};

  async fetch(key: string, options: MemCacheOption, func: () => Promise<string>) {
    const cachedValue = this.storage[key];
    if (cachedValue) {
      const expiresAt = cachedValue.cachedAt.getTime() + options.expiresIn;
      if (expiresAt < new Date().getTime()) {
        delete this.storage[key];
      } else {
        return cachedValue.value;
      }
    }

    const rawValue = await func();
    this.storage[key] = {
      value: rawValue,
      cachedAt: new Date(),
    };

    return this.storage[key].value;
  }
}
