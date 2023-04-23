import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UrlModule } from './url/url.module';
import { enviroments } from './enviroments';
import config from './config';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      /*store: redisStore,
      host: 'localhost',
      port: 6379,*/
    }),
    UrlModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      validationSchema: Joi.object({
        API_KEY: Joi.number().required(),
        API_KEY_PROD: Joi.number().required(),
        DATA_DBNAME: Joi.string().required(),
        DATA_CONNECTION: Joi.string().required(),
        DATA_USER: Joi.string().required(),
        DATA_PASS: Joi.string().required(),
        DATA_HOST: Joi.string().required(),
        DATA_PORT: Joi.number().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
