import { RequestValidator } from '@RequestValidator/index'

const rule = {
  name: {
    alpha: {},
    length: { min: 5, max: 15 },
    notNull: {},
  },
  description: {
    alphanumeric: {},
    length: { min: 4, max: 15 },
    notNull: {},
  },
}

export const taskCreateValidator = new RequestValidator('en-US', rule)
