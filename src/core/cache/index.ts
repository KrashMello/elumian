import * as crypto from "crypto";
import { type cacheData, type cacheLists } from "./type";
import { Elumian } from "..";

const secondsToMidnight = (n: Date): number => {
  return (
    (24 - n.getHours() - 1) * 60 * 60 +
    (60 - n.getMinutes() - 1) * 60 +
    (60 - n.getSeconds())
  );
};

const list: cacheLists = { Auth: [] };

let expireTime: number = 10 * 1000 * 60;

/**
 * Sets the expiration time for cached data in minutes.
 * @param expireT - The expiration time in minutes.
 */
function setConfig(expireT: number): void {
  expireTime = expireT * 1000 * 60;
}

function singCacheData(data: {
  key: string;
  data: any;
  encrypted?: boolean;
  expire?: boolean;
}): cacheData {
  const MAX_RANDOM_TIME = 4;
  const MIN_RANDOM_TIME = 1;
  const time = Math.floor(Math.random() * MAX_RANDOM_TIME) + MIN_RANDOM_TIME;
  const returnData: cacheData = {
    id: crypto.randomUUID(),
    data: data.data,
  };
  if (data.encrypted) {
    returnData.data = Elumian.crypto.hardEncrypt(data.data, time);
  }
  if (data.expire) {
    const expirationDuration = secondsToMidnight(new Date()) * expireTime;
    returnData.expireTime = new Date(Date.now() + expirationDuration);
  }

  if (!Elumian.cache.list[data.key]) Elumian.cachelist[data.key] = [];

  Elumian.cache.list[data.key]?.push(returnData);

  return returnData;
}

function getCacheDataById(key: string, id: string): cacheData | string {
  const cacheList = Elumian.cache.list[key];
  const foundItem = cacheList?.find((item: cacheData) => item.id === id);
  return foundItem ? foundItem.data : null;
}

function verifyId(key: string, id: string): boolean {
  const cacheList = Elumian.cache.list[key];
  return cacheList?.some((item: cacheData) => item.id === id) ?? false;
}

export default {
  verifyId,
  list,
  getCacheDataById,
  setConfig,
  singCacheData,
};
