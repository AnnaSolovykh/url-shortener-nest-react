import { ShortenRequest, ShortenResponse } from '../types/api'
import axiosInstance from './axiosInstance'


export async function shortenUrl(data: ShortenRequest): Promise<ShortenResponse> {
  const res = await axiosInstance.post<ShortenResponse>('/shorten', data)
  return res.data
}
