import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigType } from '@nestjs/config';
import config from '../config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const { username, password, baseName, dataconection, host, port } =
          configService.database;
        return {
          uri: `${dataconection}://${host}:${port}`,
          user: username,
          pass: password,
          dbName: baseName,
        };
      },
      inject: [config.KEY],
    }),
  ],

  exports: [MongooseModule],
})
export class DatabaseModule {}
