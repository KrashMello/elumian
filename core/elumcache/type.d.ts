export interface cacheData {
  id: string
  data: string
  expireTime: Date
}

export interface cacheLists {
  [key: string]: Array<cacheData>
}
