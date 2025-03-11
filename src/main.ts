import * as cookieParser from "cookie-parser";

import { AppModule } from "@app/app.module";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

async function bootstrap() {
  const PORT = process.env.PORT ?? 9001;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 9001, () =>
    console.log(`Server started on port = ${PORT}`),
  );
}
bootstrap();
