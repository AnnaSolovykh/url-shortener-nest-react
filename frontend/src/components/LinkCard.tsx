import { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { getLinkInfo, deleteLink } from '../api/api';
import { LinkCardProps } from '../types';

export default function LinkCard({ shortUrl, onDeleted, onInfoLoaded }: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);

  const fullUrl = `${import.meta.env.VITE_API_BASE_URL}/${shortUrl}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleInfo = async () => {
    try {
      setLoadingInfo(true);
      const info = await getLinkInfo(shortUrl);
      onInfoLoaded({ ...info });
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleDelete = async () => {
    await deleteLink(shortUrl);
    onDeleted();
  };

  return (
    <Alert variant="secondary" className="mt-4 text-center">
      <div className="mb-2">
        <Alert.Link href={fullUrl} target="_blank" rel="noopener noreferrer">
          {fullUrl}
        </Alert.Link>
      </div>

      <div className="d-flex justify-content-center gap-2 flex-wrap">
        <Button size="sm" variant="outline-primary" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </Button>

        <Button size="sm" variant="outline-info" onClick={handleInfo} disabled={loadingInfo}>
          {loadingInfo ? 'Loading...' : 'Info'}
        </Button>

        <Button size="sm" variant="outline-danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </Alert>
  );
}
