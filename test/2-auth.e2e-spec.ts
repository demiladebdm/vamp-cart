import 'dotenv/config';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { LoginDTO, RegisterDTO } from '../src/auth/auth.dto';
import { getApp, initializeApp, closeApp } from './constants';

jest.setTimeout(20000);

beforeAll(async () => {
  await initializeApp(true);
})

afterAll(async () => {
  await closeApp();
})

describe('AuthController (e2e)', () => {
  const user: RegisterDTO | LoginDTO = {
    username: 'username',
    password: 'password'
  }

  const sellerRegister: RegisterDTO = {
    username: 'seller',
    password: 'password',
    seller: true
  }

  const sellerLogin: LoginDTO = {
    username: 'seller',
    password: 'password'
  }

  let userToken: string;
  let sellerToken: string;

  it('should register seller', () => {
    return request(getApp().getHttpServer())
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(sellerRegister)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('seller');
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeTruthy();
      })
      .expect(HttpStatus.CREATED)
  })


  it('should register user', () => {
    return request(getApp().getHttpServer())
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('username');
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeFalsy();
      })
      .expect(HttpStatus.CREATED)
  })

  it('should reject duplicate registration', () => {
    return request(getApp().getHttpServer())
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.message).toEqual('User already exists');
        expect(body.code).toEqual(HttpStatus.BAD_REQUEST);
      })
      .expect(HttpStatus.BAD_REQUEST)
  })

  it('should login seller', () => {
    return request(getApp().getHttpServer())
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(sellerLogin)
      .expect(({ body }) => {
        sellerToken = body.token
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('seller');
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeTruthy();
      })
      .expect(HttpStatus.CREATED)
  })

  it('should login user', () => {
    return request(getApp().getHttpServer())
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        userToken = body.token
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('username');
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeFalsy();
      })
      .expect(HttpStatus.CREATED)
  })
})