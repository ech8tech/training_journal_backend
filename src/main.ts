import cookieParser from "cookie-parser";
import { GlobalExceptionFilter } from "src/utils/exceptions";

import { AppModule } from "@app/app.module";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

async function bootstrap() {
  const PORT = process.env.PORT ?? 9001;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.setGlobalPrefix("api");
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    origin: ["http://localhost:9000"],
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"],
    credentials: true, // если нужен обмен куки или авторизационные заголовки
    allowedHeaders: "Content-Type, Accept, Authorization, Refresh", // список разрешённых заголовков
    optionsSuccessStatus: 204, // статус ответа для preflight запроса
  });

  await app.listen(process.env.PORT ?? 9001, () =>
    console.log(`Server started on port = ${PORT}`),
  );
}
bootstrap();
