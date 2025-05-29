import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { FastifyReply } from "fastify";

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') implements CanActivate {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('🔥 GoogleAuthGuard activated');

    const httpContext = context.switchToHttp();
    const res = httpContext.getResponse<FastifyReply>();

    // Save the original redirect method
    const originalRedirect = res.redirect.bind(res);

    (res as any).setHeader = (key: string, value: string) => {
      res.header(key, value);
    };

    (res as any).writeHead = (statusCode: number, headers: Record<string, string>) => {
      res.status(statusCode);
      for (const [key, value] of Object.entries(headers)) {
        res.header(key, value);
      }
    };

    (res as any).redirect = function (status: number, url?: string) {
      if (typeof url === 'undefined') {
        url = status as any;
        status = 302;
      }
      return originalRedirect(url!,status);
    };

    (res as any).end = function () {
      console.log('💀 res.end() called — sending Fastify response');
      res.send(); 
    };

    (res as any).statusCode = res.statusCode || 200;

    const result = (await super.canActivate(context)) as boolean;
    console.log('✅ Passport Auth Result:', result);

    return result;
  }
}
