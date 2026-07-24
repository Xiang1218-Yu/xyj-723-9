import { STORAGE_KEYS } from '../constants/index';
import { safeJsonParse } from './common';

/**
 * 同步存储封装
 */
export const storage = {
  set<T>(key: string, data: T): void {
    try {
      wx.setStorageSync(key, data);
    } catch (err) {
      console.error('[storage.set] failed:', key, err);
    }
  },

  get<T>(key: string, fallback: T | null = null): T | null {
    try {
      const data = wx.getStorageSync(key);
      return (data !== '' ? data : fallback) as T | null;
    } catch (err) {
      console.error('[storage.get] failed:', key, err);
      return fallback;
    }
  },

  remove(key: string): void {
    try {
      wx.removeStorageSync(key);
    } catch (err) {
      console.error('[storage.remove] failed:', key, err);
    }
  },

  clear(): void {
    try {
      wx.clearStorageSync();
    } catch (err) {
      console.error('[storage.clear] failed:', err);
    }
  },
};

/**
 * 快递历史记录管理
 */
export const expressStorage = {
  KEY_PREFIX: STORAGE_KEYS.EXPRESS_HISTORY_PREFIX,

  getAll(): Array<{ number: string; time: string }> {
    const result: Array<{ number: string; time: string }> = [];
    try {
      const info = wx.getStorageInfoSync();
      info.keys.forEach((key) => {
        if (key.startsWith(expressStorage.KEY_PREFIX)) {
          const data = safeJsonParse<{ number: string; time: string }>(wx.getStorageSync(key), {
            number: '',
            time: '',
          });
          if (data.number) result.push(data);
        }
      });
    } catch (err) {
      console.error('[expressStorage.getAll] failed:', err);
    }
    return result.sort((a, b) => b.time.localeCompare(a.time));
  },

  save(number: string): void {
    const key = `${expressStorage.KEY_PREFIX}${number}`;
    storage.set(key, JSON.stringify({ number, time: new Date().toISOString() }));
  },

  remove(number: string): void {
    storage.remove(`${expressStorage.KEY_PREFIX}${number}`);
  },
};
