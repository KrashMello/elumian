export interface cacheData {
  id: string
  data: string
}

export interface cacheLists {
  [key: string]: Array<cacheData>
}
