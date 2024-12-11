import 'dotenv/config';
import * as request from 'supertest';
import { closeApp, getApp, initializeApp } from './constants';
import { HttpStatus } from '@nestjs/common';

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
      .expect(HttpStatus.OK)
      .expect({
        hello: 'Hello World!'
      });
  });
});