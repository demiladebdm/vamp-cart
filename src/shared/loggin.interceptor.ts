import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LogginInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();

    const { method, url } = req;

    return next.handle().pipe(
      tap(() => Logger.log(`${method} ${url} ${Date.now() - now}ms`, context.getClass().name))
    )
  }
}