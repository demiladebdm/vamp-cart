import 'dotenv/config';
import axios from 'axios';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { LoginDTO, RegisterDTO } from '../src/auth/auth.dto';
import { CreateProductDTO } from '../src/product/product.dto';
import { getApp, initializeApp, closeApp } from './constants';

let sellerToken: string;
let productSeller: RegisterDTO = {
  username: 'sellernew',
  password: 'password',
  seller: true
};

jest.setTimeout(20000);

beforeAll(async () => {
  await initializeApp(true);
})

afterAll(async () => {
  await closeApp();
})

describe('ProductController (e2e)', () => {
  const sellerRegister: RegisterDTO = {
    username: 'sellernew',
    password: 'password',
    seller: true
  }

  const sellerLogin: LoginDTO = {
    username: 'sellernew',
    password: 'password'
  }

  const product: CreateProductDTO = {
    title: 'new phone',
    image: 'n/a',
    description: 'description',
    price: 10,
    count: 5
  };

  let productId: string;

  it('should register seller', () => {
    return request(getApp().getHttpServer())
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(sellerRegister)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('sellernew');
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeTruthy();
      })
      .expect(HttpStatus.CREATED)
  })

  it('should login seller', () => {
    return request(getApp().getHttpServer())
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(sellerLogin)
      .expect(({ body }) => {
        sellerToken = body.token
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('sellernew');
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeTruthy();
      })
      .expect(HttpStatus.CREATED)
  })

  it('should list all products', () => {
    return request(getApp().getHttpServer())
      .get('/product')
      .expect(HttpStatus.OK);
  });

  it('should list my products', () => {
    return request(getApp().getHttpServer())
      .get('/product/mine')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(HttpStatus.OK);
  });

  it('should create product', () => {
    return request(getApp().getHttpServer())
      .post('/product')
      .set('Authorization', `Bearer ${sellerToken}`)
      .set('Accept', 'application/json')
      .send(product)
      .expect(({ body }) => {
        expect(body._id).toBeDefined();
        productId = body._id;
        expect(body.title).toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.price).toEqual(product.price);
        expect(body.owner.username).toEqual(productSeller.username);
      })
      .expect(HttpStatus.CREATED);
  });

  it('should read product', () => {
    return request(getApp().getHttpServer())
      .get(`/product/${productId}`)
      .expect(({ body }) => {
        expect(body.title).toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.price).toEqual(product.price);
        expect(body.owner.username).toEqual(productSeller.username);
      })
      .expect(HttpStatus.OK);
  });

  it('should update product', () => {
    return request(getApp().getHttpServer())
      .put(`/product/${productId}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .set('Accept', 'application/json')
      .send({
        title: 'New Product',
      })
      .expect(({ body }) => {
        expect(body.title).not.toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.price).toEqual(product.price);
        expect(body.owner.username).toEqual(productSeller.username);
      })
      .expect(HttpStatus.OK);
  });

  it('should delete product', async () => {
    await request(getApp().getHttpServer())
      .delete(`/product/${productId}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(HttpStatus.OK);

    return request(getApp().getHttpServer())
      .get(`/product/${productId}`)
      .expect(HttpStatus.NO_CONTENT);
  });
});