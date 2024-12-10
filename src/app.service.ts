import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    // return { hello: 'Hello World!' };
    const response = { hello: 'Hello World!' };
    console.log("Response", response)
    return response
  }
}
