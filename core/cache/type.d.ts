interface cacheData {
  id: string
  data: string
}

interface cacheList {
  [key: string]: Array<cacheData>
}
