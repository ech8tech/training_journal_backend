import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app/app.module";

async function bootstrap() {
  const PORT = process.env.PORT ?? 9001;
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 9001, () =>
    console.log(`Server started on port = ${PORT}`),
  );
}
bootstrap();
