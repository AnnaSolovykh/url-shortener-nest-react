import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('URL Shortener E2E — full coverage', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const alias = 'e2e-full-test';

  it('POST /shorten — creates short URL with alias', async () => {
    const res = await request(app.getHttpServer())
      .post('/shorten')
      .send({
        originalUrl: 'https://e2e-test.com',
        alias,
      })
      .expect(201);

    expect(res.body.shortUrl).toContain(alias);
  });

  it('GET /:alias — redirects to original URL', async () => {
    const res = await request(app.getHttpServer())
      .get(`/${alias}`)
      .expect(302);

    expect(res.headers.location).toBe('https://e2e-test.com');
  });

  it('GET /info/:alias — returns link info', async () => {
    const res = await request(app.getHttpServer())
      .get(`/info/${alias}`)
      .expect(200);

    expect(res.body).toMatchObject({
      originalUrl: 'https://e2e-test.com',
      clickCount: expect.any(Number),
    });
  });

  it('GET /analytics/:alias — returns recent IPs', async () => {
    const res = await request(app.getHttpServer())
      .get(`/analytics/${alias}`)
      .expect(200);

    expect(res.body).toHaveProperty('totalClicks');
    expect(res.body).toHaveProperty('recentIps');
    expect(Array.isArray(res.body.recentIps)).toBe(true);
  });

  it('DELETE /delete/:alias — deletes the link', async () => {
    await request(app.getHttpServer())
      .delete(`/delete/${alias}`)
      .expect(200);
  });

  it('GET /info/:alias — returns 404 after deletion', async () => {
    await request(app.getHttpServer())
      .get(`/info/${alias}`)
      .expect(404);
  });
});
