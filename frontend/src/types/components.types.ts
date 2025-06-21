import { LinkInfo } from './api.types';

export interface LinkCardProps {
  shortUrl: string;
  onDelete: () => Promise<void>;
}

export interface AnalyticsCardProps {
  shortUrl: string;
}
export interface LinkInfoCardProps {
  linkInfo: LinkInfo | null;
  loading?: boolean;
  error?: string;
}
