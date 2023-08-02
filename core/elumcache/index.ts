import { Eluncoder } from '@Encoder/index'
import { v4 as uuidv4 } from 'uuid'
import { cacheData, cacheLists } from './type'

const secondsToMidnight = (n: Date) => {
  return (
    (24 - n.getHours() - 1) * 60 * 60 +
    (60 - n.getMinutes() - 1) * 60 +
    (60 - n.getSeconds())
  )
}

export let cacheList: cacheLists = { Auth: [] }
let encoder = new Eluncoder()
let expireTime: number = 5 * 1000 * 60

export function setConfig(expireT: number) {
  expireTime = expireT * 1000 * 60
}

export function singCacheData(key: string, data: object): cacheData {
  let time = Math.floor(Math.random() * 10) + 1
  let encriptedData: cacheData = {
    id: uuidv4(),
    data: encoder.hardEncrypter(data, time),
    expireTime: new Date(
      new Date().getTime() + secondsToMidnight(new Date()) * expireTime
    ),
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

  return encriptedData
}

export function getCacheDataById(key: string, id: string): cacheData | string {
  let filterById = cacheList[key]?.filter((v: cacheData) => v.id === id)[0]
    ?.data
  if (filterById) return filterById
  else return `dont exists data in cache`
}

export function verifyId(key: string, id: string): boolean {
  if (cacheList[key]?.filter((v: cacheData) => v.id === id)[0]) return true
  else return false
}

export function length(key: string) {
  return cacheList[key]?.length
}
