import { NestFactory } from "@nestjs/core";
import { json, urlencoded } from "body-parser";
import { AppModule } from "./app.module";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
  const port = 3019;
  await app.listen(port);
  console.log(
    `Application is running on: ${await app.getUrl()} => ${join(
      __dirname,
      process.platform === "linux" ? ".." : ".",
      "uploads"
    )}`
  );
}
bootstrap();
