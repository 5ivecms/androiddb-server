import axios from 'axios'
import { PDALIFE_BASE_URL } from './pdalife-parser.routes'

const axiosConfig = {
  baseURL: PDALIFE_BASE_URL,
  timeout: 30000,
}

export const pdalifeAxios = axios.create(axiosConfig)
