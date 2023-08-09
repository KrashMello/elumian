import { Eluncoder } from '@Encoder/index'
import { v4 as uuidv4 } from 'uuid'
import { type cacheData, type cacheLists } from './type'

const secondsToMidnight = (n: Date): number => {
  return (
    (24 - n.getHours() - 1) * 60 * 60 +
    (60 - n.getMinutes() - 1) * 60 +
    (60 - n.getSeconds())
  )
}

export const cacheList: cacheLists = { Auth: [] }
const encoder = new Eluncoder()
let expireTime: number = 5 * 1000 * 60

export function setConfig (expireT: number): void {
  expireTime = expireT * 1000 * 60
}

export function singCacheData (key: string, data: object): cacheData {
  const time = Math.floor(Math.random() * 10) + 1
  const encriptedData: cacheData = {
    id: uuidv4(),
    data: encoder.hardEncrypter(data, time),
    expireTime: new Date(
      new Date().getTime() + secondsToMidnight(new Date()) * expireTime
    )
  }

  if (cacheList[key] == null) cacheList[key] = []

  cacheList[key]?.push(encriptedData)

  setTimeout(() => {
    cacheList[key]?.forEach((v: cacheData, i: number) => {
      if (v.id === encriptedData.id) {
        cacheList[key] = cacheList[key]?.filter(
          (_, k: number) => k !== i
        ) as cacheData[]
      }
    })
  }, expireTime)

  return encriptedData
}

export function getCacheDataById (key: string, id: string): cacheData | string {
  const filterById = cacheList[key]?.filter((v: cacheData) => v.id === id)[0]
    ?.data
  if (filterById != null) return filterById
  else return 'dont exists data in cache'
}

export function verifyId (key: string, id: string): boolean {
  if (cacheList[key]?.filter((v: cacheData) => v.id === id)[0] != null) { return true } else return false
}
