import { Eluncoder } from '@Encoder/index'
import { v4 as uuidv4 } from 'uuid'
import { cacheData, cacheLists } from './type'

export let cacheList: cacheLists = {}
let encoder = new Eluncoder()
let expireTime: number = 1 * 1000 * 60

export function setConfig(expireT: number) {
  expireTime = expireT * 1000 * 60
}

export function singCacheData(key: string, data: object) {
  let time = Math.floor(Math.random() * 10) + 1
  let encriptedData: cacheData = {
    id: uuidv4(),
    data: encoder.hardEncrypter(data, time),
  }

  if (!cacheList[key]) cacheList[key] = []

  cacheList[key]?.push(encriptedData)

  setTimeout(() => {
    cacheList[key]?.map((v: cacheData, i: number) => {
      if (v.id === encriptedData.id)
        cacheList[key] = cacheList[key]?.filter(
          (_, k: number) => k !== i
        ) as Array<cacheData>
    })
  }, expireTime)
}

export function getCacheDataById(key: string, id: string): cacheData | string {
  let filterById = cacheList[key]?.filter((v: cacheData) => v.id === id)[0]
    ?.data
  if (filterById) return filterById
  else return `dont exists data in cache`
}

export function length(key: string) {
  return cacheList[key]?.length
}
