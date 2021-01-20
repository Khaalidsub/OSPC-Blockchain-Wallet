import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './exceptions.filter';
import { join } from 'path';
import * as hbs from 'express-hbs';
import { format } from 'date-fns';
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
  // app.set('view options', { layout: 'main' });
  hbs.registerHelper('formatDate', function (date) {
    return format(new Date(date), 'PP');
  });
  app.engine(
    'hbs',
    hbs.express4({
      partialsDir: `/usr/src/app/views/partials`,
      defaultLayout: `/usr/src/app/views/layouts/main`,
    }),
  );
  console.log(__dirname);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
