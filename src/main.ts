import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './exceptions.filter';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.set('trust proxy', 1);
  // app.enableCors({ origin: 'http://127.0.0.1:3050' });
  app
    .use(cookieParser())
    .use(bodyParser.json())
    .use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
