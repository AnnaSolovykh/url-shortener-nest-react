export interface ShortenRequest {
  originalUrl: string;
  alias?: string;
  expiresAt?: string;
}

export interface ShortenResponse {
  shortUrl: string;
}

export interface LinkInfo {
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  clickCount: number;
}

export interface ClickInfo {
  ip: string;
  time: string;
}

export interface AnalyticsInfo {
  totalClicks: number;
  recentClicks: ClickInfo[];
}
