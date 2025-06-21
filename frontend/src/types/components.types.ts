import { LinkInfo } from './api.types';

export interface LinkCardProps {
  shortUrl: string;
  onDeleted: () => void;
  onInfoLoaded: (data: LinkInfo) => void;
}
