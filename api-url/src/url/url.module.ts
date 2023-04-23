import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UrlService } from './services/url.service';
import { UrlController } from './controllers/url.controller';
import { Url, UrlSchema } from './entities/url.entity';
import { UrlExceptions } from './httpErrors/urlExceptions';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Url.name,
        schema: UrlSchema,
      },
    ]),
  ],
  providers: [UrlService, UrlExceptions],
  controllers: [UrlController],
})
export class UrlModule {}
