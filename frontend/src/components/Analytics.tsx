import { useCallback, useEffect, useState } from 'react';
import { Alert, Spinner, ListGroup, Button } from 'react-bootstrap';
import { getAnalytics, getLinkInfo } from '../api/api';
import { AnalyticsCardProps, AnalyticsInfo, LinkInfo } from '../types';
import LinkInfoCard from './LinkInfoCard.tsx';

export default function AnalyticsCard({ shortUrl }: AnalyticsCardProps) {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsInfo | null>(null);
  const [linkInfo, setLinkInfo] = useState<LinkInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [linkInfoError, setLinkInfoError] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const alias = shortUrl.split('/').pop()!;

      const [analyticsData, linkInfoData] = await Promise.all([
        getAnalytics(alias),
        getLinkInfo(alias),
      ]);

      setAnalytics(analyticsData);
      setLinkInfo(linkInfoData);
      setError('');
      setLinkInfoError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load analytics');
      setLinkInfoError('Failed to load link info');
    }
  }, [shortUrl]);

  useEffect(() => {
    const fetchInitial = async () => {
      await fetchData();
      setLoading(false);
    };
    fetchInitial();
  }, [fetchData]);

  useEffect(() => {
    const handleFocus = () => {
      if (shortUrl) fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData, shortUrl]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!analytics) return <Alert variant="warning">No analytics found.</Alert>;

  return (
    <>
      <LinkInfoCard linkInfo={linkInfo} loading={false} error={linkInfoError} />

      <Alert variant="light" className="mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Analytics</h5>
          <Button variant="outline-primary" size="sm" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? <Spinner animation="border" size="sm" /> : 'Refresh'}
          </Button>
        </div>

        <p>
          <strong>Total Clicks:</strong> {analytics.totalClicks}
        </p>

        {analytics.recentClicks.length > 0 ? (
          <ListGroup variant="flush">
            {analytics.recentClicks.map(({ ip, time }, index) => (
              <ListGroup.Item key={index}>
                <div>
                  <strong>IP:</strong> {ip}
                </div>
                <div>
                  <strong>Time:</strong> {new Date(time).toLocaleString()}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <Alert variant="secondary">No recent clicks.</Alert>
        )}
      </Alert>
    </>
  );
}
