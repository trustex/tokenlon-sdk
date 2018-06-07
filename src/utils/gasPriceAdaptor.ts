import { GasPriceAdaptor } from '../types'
import axios from 'axios'
import { ETH_GAS_STATION_URL } from '../constants'
import { getTimestamp, newError } from './helper'

const getGasPriceByAdaptorHelper = async (adaptor: GasPriceAdaptor): Promise<number> => {
  return axios(ETH_GAS_STATION_URL).then(res => {
    return res.data[adaptor] * 0.1
  }).catch(e => {
    throw newError(`${ETH_GAS_STATION_URL} server error ${e && e.message}`)
  })
}

const stack = {}

export const getGasPriceByAdaptorAsync = async (adaptor: GasPriceAdaptor): Promise<number> => {
  if (stack[adaptor] && stack[adaptor].timestamp < getTimestamp() + 60) {
    return stack[adaptor].gasPrice
  } else {
    const gasPrice = await getGasPriceByAdaptorHelper(adaptor)
    const gasPriceInGwei = gasPrice * Math.pow(10, 9) // gwei process
    stack[adaptor] = {
      gasPrice: gasPriceInGwei,
      timestamp: getTimestamp(),
    }
    return gasPriceInGwei
  }
}