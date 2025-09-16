import { ChartsModule } from "src/charts/charts.module";
import { ExercisesModule } from "src/exercises/exercises.module";
import { ProfilesModule } from "src/profiles/profiles.module";
import { SessionsModule } from "src/sessions/sessions.module";
import { SetsModule } from "src/sets/sets.module";
import { DataSource } from "typeorm";

import { AuthModule } from "@auth/auth.module";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "@users/users.module";

import { AppService } from "./app.service";

@Module({
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env"],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true,
      autoLoadEntities: true,
      // dropSchema: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 0,
    }),
    AuthModule,
    UsersModule,
    ProfilesModule,
    ExercisesModule,
    // UsersExercisesModule,
    SessionsModule,
    SetsModule,
    ChartsModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
