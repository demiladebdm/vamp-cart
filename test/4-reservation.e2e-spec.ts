
import 'dotenv/config';
import axios from 'axios';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { LoginDTO, RegisterDTO } from '../src/auth/auth.dto';
import { CreateProductDTO } from '../src/product/product.dto';
import { getApp, initializeApp, closeApp } from './constants';
import { Product } from '../src/types/product';

let buyerToken: string;
let sellerToken: string;
let boughtProducts: Product[] = [];
const reservationSeller: RegisterDTO = {
  seller: true,
  username: 'reservationSeller',
  password: 'password',
};
const reservationBuyer: RegisterDTO = {
  seller: false,
  username: 'username',
  password: 'password',
};
const soldProducts: CreateProductDTO[] = [
  {
    title: 'newer phone',
    image: 'n/a',
    description: 'description',
    price: 10,
    count: 5
  },
  {
    title: 'newest phone',
    image: 'n/a',
    description: 'description',
    price: 20,
    count: 3
  },
];

jest.setTimeout(30000);

beforeAll(async () => {
  await initializeApp(true);
})

afterAll(async () => {
  await closeApp();
})

describe('ReservationController (e2e)', () => {
  it('should register seller', () => {
    return request(getApp().getHttpServer())
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(reservationSeller)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('reservationSeller');
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeTruthy();
      })
      .expect(HttpStatus.CREATED)
  })

  it('should login seller', () => {
    return request(getApp().getHttpServer())
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(reservationSeller)
      .expect(({ body }) => {
        sellerToken = body.token
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('reservationSeller');
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeTruthy();
      })
      .expect(HttpStatus.CREATED)
  })

  it('should login buyer', () => {
    return request(getApp().getHttpServer())
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(reservationBuyer)
      .expect(({ body }) => {
        buyerToken = body.token
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('username');
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeFalsy();
      })
      .expect(HttpStatus.CREATED)
  })

  it('should create test products for reservation', async () => {
    for (const product of soldProducts) {
      const response = await request(getApp().getHttpServer())
        .post('/product')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send(product)
        .expect(HttpStatus.CREATED);

      boughtProducts.push(response.body);
    }
    expect(boughtProducts.length).toEqual(soldProducts.length);
  });


  it('should fetch and assign products to boughtProducts', async () => {
    const response = await request(getApp().getHttpServer())
      .get('/product')
      .expect(200);

    boughtProducts = response.body;
    expect(boughtProducts.length).toBeGreaterThan(0);
  });

  it('should create reservation of all products', async () => {
    const reservationDTO = {
      products: boughtProducts.map(product => ({
        product: product._id,
        quantity: 1,
      })),
    };

    console.log('Reservation DTO:', reservationDTO);

    return request(getApp().getHttpServer())
      .post('/reservation')
      .set('Authorization', `Bearer ${buyerToken}`)
      .set('Accept', 'application/json')
      .send(reservationDTO)
      .expect(({ body }) => {
        console.log('Response Body:', body);
        expect(body.owner.username).toEqual(reservationBuyer.username);
        expect(body.products.length).toEqual(boughtProducts.length);
        expect(
          boughtProducts
            .map(product => product._id)
            .includes(body.products[0].product._id),
        ).toBeTruthy();
        expect(body.totalPrice).toEqual(
          boughtProducts.reduce((acc, i) => acc + i.price, 0),
        );
      })
      .expect(201);
  });

  it('should list all reservations of buyer', () => {
    return request(getApp().getHttpServer())
      .get('/reservation')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(({ body }) => {
        console.log('Reservation List:', body);
        expect(body.length).toEqual(1);
        expect(body[0].products.length).toEqual(boughtProducts.length);
        expect(
          boughtProducts
            .map(product => product._id)
            .includes(body[0].products[1].product._id),
        ).toBeTruthy();
        expect(body[0].totalPrice).toEqual(
          boughtProducts.reduce((acc, i) => acc + i.price, 0),
        );
      })
      .expect(200);
  });
});