import { Alert, Button } from 'react-bootstrap';
import { LinkCardProps } from '../types';

export default function LinkCard({ shortUrl, onDelete }: LinkCardProps) {
  return (
    <Alert variant="success" className="mt-4 text-center">
      <strong>Your short URL:</strong>{' '}
      <a href={shortUrl} target="_blank" rel="noopener noreferrer">
        {shortUrl}
      </a>
      {onDelete && (
        <div className="mt-3">
          <Button variant="outline-danger" size="sm" onClick={onDelete}>
            Delete Link
          </Button>
        </div>
      )}
    </Alert>
  );
}
