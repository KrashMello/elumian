export interface cacheData {
  id: string;
  data: string;
  expireTime?: Date;
}

export type cacheLists = Record<string, cacheData[]>;
