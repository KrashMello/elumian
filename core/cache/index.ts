import { Eluncoder } from '@Encoder/index'
import { v4 as uuidv4 } from 'uuid'

let cacheList: cacheList = {}
let encoder = new Eluncoder()
let expireTime: number

export function setConfig(expireT: number) {
  expireTime = expireT * 1000
}

export function singCacheData(key: string, data: object) {
  let time = Math.floor(Math.random() * 10) + 1
  let encriptedData: cacheData = {
    id: uuidv4(),
    data: encoder.hardEncrypter(data, time),
  }

  cacheList[key] = []
  cacheList[key]?.push(encriptedData)

  setTimeout(() => {
    cacheList[key]?.map((v, i) => {
      if (v.id === encriptedData.id) delete cacheList[i]
    })
  }, expireTime)
}

export function getCacheDataById(key: string, id: string): cacheData | string {
  let filterById = cacheList[key]?.filter((v) => v.id === id)[0]?.data
  if (filterById) return filterById
  else return `dont exists data in cache`
}

export function length(key: string) {
  return cacheList[key]?.length
}

/* 
cache = new Cache()
cache.agregarUsuario({ id: 1, name: 'asd' })
setTimeout(() => {
  console.log(cache.obtenerUsuario(1))
}, 5000)
setTimeout(() => {
  console.log(cache.obtenerUsuario(1))
}, 10001)
*/
