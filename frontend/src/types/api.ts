export interface ShortenRequest {
  originalUrl: string
  alias?: string
  expiresAt?: string
}

export interface ShortenResponse {
  shortUrl: string
}
