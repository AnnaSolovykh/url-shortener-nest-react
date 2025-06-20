import { useState } from 'react'
import { Container, Form, Button, Alert } from 'react-bootstrap'

function App() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShortUrl('https://sho.rt/abc123') // временно
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <div style={{ maxWidth: 500, width: '100%' }}>
        <h1 className="mb-4 text-center">URL Shortener</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUrl">
            <Form.Label>Enter your URL</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </Form.Group>
          <div className="d-grid">
            <Button type="submit" variant="primary">
              Shorten
            </Button>
          </div>
        </Form>

        {shortUrl && (
          <Alert variant="success" className="mt-4 text-center">
            Shortened URL: <a href={shortUrl}>{shortUrl}</a>
          </Alert>
        )}
      </div>
    </Container>
  )
}

export default App
