import React from 'react';
import { useEffect, useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { ShortenRequest, LinkInfo } from '../types/api.types';
import { getLinkInfo, shortenUrl } from '../api/api';
import { useDelayedValue } from '../hooks/useDelayedValue';
import axios from 'axios';
import LinkCard from '../components/LinkCard';

function Home() {
  const [form, setForm] = useState<ShortenRequest>({
    originalUrl: '',
    alias: '',
    expiresAt: '',
  });
  const [shortUrl, setShortUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [linkInfo, setLinkInfo] = useState<LinkInfo | null>(null);

  const delayedShortUrl = useDelayedValue(shortUrl, 200);
  const delayedError = useDelayedValue(error, 200);

  useEffect(() => {
    const handleFocus = async () => {
      if (!shortUrl) return;
      const alias = new URL(shortUrl).pathname.slice(1);
      try {
        const info = await getLinkInfo(alias);
        setLinkInfo(info);
      } catch (err) {
        console.error('Failed to update link info', err);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [shortUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanedForm = {
        originalUrl: form.originalUrl,
        alias: form.alias?.trim() === '' ? undefined : form.alias,
        expiresAt: form.expiresAt?.trim() === '' ? undefined : form.expiresAt,
      };

      const res = await shortenUrl(cleanedForm);
      setShortUrl(res.shortUrl);
      setError('');
      setLinkInfo(null);
      setForm({ originalUrl: '', alias: '', expiresAt: '' });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && typeof err.response?.data?.message === 'string') {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Try again.');
      }
      setShortUrl('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <h1 className="mb-4 text-center">URL Shortener</h1>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Original URL</Form.Label>
                <Form.Control
                  type="url"
                  name="originalUrl"
                  placeholder="https://example.com"
                  value={form.originalUrl}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Custom Alias (optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="alias"
                  placeholder="e.g. my-link"
                  value={form.alias || ''}
                  onChange={handleChange}
                  maxLength={20}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Expiration Date (optional)</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="expiresAt"
                  value={form.expiresAt || ''}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="text-center">
                <Button type="submit" variant="primary" disabled={loading}>
                  Shorten URL
                </Button>
              </div>
            </Form>

            {delayedShortUrl && (
              <LinkCard
                shortUrl={new URL(delayedShortUrl).pathname.slice(1)}
                onDeleted={() => {
                  setShortUrl('');
                  setLinkInfo(null);
                }}
                onInfoLoaded={(info) => setLinkInfo({ ...info })}
              />
            )}

            {linkInfo && (
              <Alert variant="info" className="mt-3">
                <p>
                  <strong>Original URL:</strong> {linkInfo.shortUrl}
                </p>
                <p>
                  <strong>Created At:</strong> {new Date(linkInfo.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Click Count:</strong> {linkInfo.clickCount}
                </p>
                <div className="text-end text-success small">
                  ✔ Обновлено в {new Date().toLocaleTimeString()}
                </div>
              </Alert>
            )}

            {delayedError && (
              <Alert variant="danger" className="mt-4 text-center">
                {delayedError}
              </Alert>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
