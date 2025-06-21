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
  createdAt: string;
  clickCount: number;
}

export interface AnalyticsInfo {
  clickCount: number;
  recentClicks: string[];
}
