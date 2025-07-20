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
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "training_journal",
      synchronize: true,
      autoLoadEntities: true,
      // dropSchema: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 0,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    ProfilesModule,
    ExercisesModule,
    // UsersExercisesModule,
    SessionsModule,
    SetsModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
