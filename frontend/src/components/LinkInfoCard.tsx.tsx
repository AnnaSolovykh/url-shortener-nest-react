import { Alert, Spinner } from 'react-bootstrap';
import { LinkInfoCardProps } from '../types';

export default function LinkInfoCard({ linkInfo, loading, error }: LinkInfoCardProps) {
  if (loading) return <Spinner animation="border" size="sm" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!linkInfo) return <Alert variant="warning">No link info found.</Alert>;

  return (
    <Alert variant="info" className="mt-3">
      <p className="mb-2">
        <strong>Original URL:</strong> {linkInfo.originalUrl}
      </p>
      <p className="mb-2">
        <strong>Created At:</strong> {new Date(linkInfo.createdAt).toLocaleString()}
      </p>
      <div className="text-end text-success small">
        ✔ Updated at {new Date().toLocaleTimeString()}
      </div>
    </Alert>
  );
}
