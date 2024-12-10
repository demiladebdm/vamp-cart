import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { LoginDTO, RegisterDTO } from '../src/auth/auth.dto';
import * as mongoose from 'mongoose';

jest.setTimeout(20000);

let app: INestApplication;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await mongoose.connection.db.dropDatabase();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
})

afterAll(async () => {
  if (app) {
    await app.close();
  }
  await mongoose.disconnect();
})

describe('AppController (e2e)', () => {
  it('should ping', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({
        hello: 'Hello World!'
      });
  });
});

describe('AuthController (e2e)', () => {
  it('should register', () => {
    const user: RegisterDTO = {
      username: 'username',
      password: 'password'
    }

    return request(app.getHttpServer())
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('username');
        expect(body.user.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED)
  })

  it('should reject duplicate registration', () => {
    const user: RegisterDTO = {
      username: 'username',
      password: 'password'
    }

    return request(app.getHttpServer())
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.message).toEqual('User already exists');
        expect(body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      })
      .expect(HttpStatus.BAD_REQUEST)
  })

  it('should login', () => {
    const user: LoginDTO = {
      username: 'username',
      password: 'password'
    }

    return request(app.getHttpServer())
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('username');
        expect(body.user.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED)
  })
})


// import 'dotenv/config';
// import * as request from 'supertest';

// // jest.setTimeout(10000);
// const app = 'http://localhost:3000';

// describe('ROOT', () => {
//   it('should ping', () => {
//     return request(app)
//       .get('/')
//       .expect(200)
//       .expect({
//         hello: 'Hello World!'
//       });
//   });
// });

// // const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// // describe('ROOT', () => {
// //   it('should ping', async () => {
// //     await delay(1000);
// //     const response = await request(app).get('/');
// //     console.log(response.body);
// //     expect(response.status).toBe(200);
// //     expect(response.body).toEqual({
// //       hello: 'Hello World!',
// //     });
// //   });
// // });
