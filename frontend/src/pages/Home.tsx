import { useState } from 'react'
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { ShortenRequest } from '../types/api'
import { shortenUrl } from '../api/api'
import { useDelayedValue } from '../hooks/useDelayedValue'
import axios from 'axios'

function Home() {
  const [form, setForm] = useState<ShortenRequest>({
    originalUrl: '',
    alias: '',
    expiresAt: '',
  })
  const [shortUrl, setShortUrl] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const delayedShortUrl = useDelayedValue(shortUrl, 200)
  const delayedError = useDelayedValue(error, 200)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    const cleanedForm = {
      originalUrl: form.originalUrl,
      alias: form.alias?.trim() === '' ? undefined : form.alias,
      expiresAt: form.expiresAt?.trim() === '' ? undefined : form.expiresAt,
    }

    const res = await shortenUrl(cleanedForm)
    setShortUrl(res.shortUrl)
    setError('') 
    setForm({ originalUrl: '', alias: '', expiresAt: '' }) 
  } catch (err: unknown) {
  if (
    axios.isAxiosError(err) &&
    typeof err.response?.data?.message === 'string'
  ) {
    setError(err.response.data.message)
  } else {
    setError('Something went wrong. Try again.')
  }
  setShortUrl('')
  } finally {
    setLoading(false)
  }
}

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
              <Alert variant="success" className="mt-4 text-center">
                Shortened URL:{' '}
                <Alert.Link href={delayedShortUrl} target="_blank" rel="noopener noreferrer">
                  {delayedShortUrl}
                </Alert.Link>
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
  )
}

export default Home
