import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /version', () => {
    return request(app.getHttpServer()).get('/version').expect(200).expect('0.0.1');
  });

  it('GET /health', () => {
    return request(app.getHttpServer()).get('/health').expect(200).expect({ alive: true });
  });
});
