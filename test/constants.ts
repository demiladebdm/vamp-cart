import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { AppModule } from './../src/app.module';

let _app: INestApplication;

export const setApp = (app: INestApplication) => {
  _app = app;
};

export const getApp = (): INestApplication => {
  if (!_app) {
    throw new Error('App is not initialized');
  }
  return _app;
};

export const initializeApp = async (useDatabase: boolean = false) => {
  if (useDatabase) {
    await mongoose.connect(process.env.MONGO_URI_TEST);
    await mongoose.connection.db.dropDatabase();
  }

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule]
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  setApp(app);
}

export const closeApp = async () => {
  const app = getApp();
  if (app) {
    await app.close();
  }

  await mongoose.disconnect();
}
