import 'dotenv/config';
import * as request from 'supertest';
import { closeApp, getApp, initializeApp } from './constants';

describe('AppController (e2e)', () => {
  jest.setTimeout(20000);

  beforeAll(async () => {
    await initializeApp();
  })

  afterAll(async () => {
    await closeApp()
  })

  it('should ping', async () => {
    await request(getApp().getHttpServer())
      .get('/')
      .expect(200)
      .expect({
        hello: 'Hello World!'
      });
  });
});