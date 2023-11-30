import { type cacheData, type cacheLists } from './type';
export declare const cacheList: cacheLists;
export declare function setConfig(expireT: number): void;
export declare function singCacheData(key: string, data: object): cacheData;
export declare function getCacheDataById(key: string, id: string): cacheData | string;
export declare function verifyId(key: string, id: string): boolean;
