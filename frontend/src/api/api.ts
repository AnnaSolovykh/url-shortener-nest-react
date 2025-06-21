import { ShortenRequest, ShortenResponse, LinkInfo, AnalyticsInfo } from '../types';
import axiosInstance from './axiosInstance';

export async function shortenUrl(data: ShortenRequest): Promise<ShortenResponse> {
  const res = await axiosInstance.post<ShortenResponse>('/shorten', data);
  return res.data;
}

export async function getLinkInfo(shortUrl: string): Promise<LinkInfo> {
  const res = await axiosInstance.get(`/info/${shortUrl}`);
  return res.data;
}

export async function deleteLink(shortUrl: string): Promise<void> {
  await axiosInstance.delete(`/delete/${shortUrl}`);
}

export async function getAnalytics(shortUrl: string): Promise<AnalyticsInfo> {
  const res = await axiosInstance.get(`/analytics/${shortUrl}`);
  return res.data;
}
