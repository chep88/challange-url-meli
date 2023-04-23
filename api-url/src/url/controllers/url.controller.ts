import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  NotFoundException,
  Inject,
  Res,
  Req,
  Delete,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigType } from '@nestjs/config';
import { UrlService } from '../services/url.service';
import { CreateUrlDto } from '../dtos/url.dtos';
import config from '../../config';
import { Response, Request } from 'express';

@Controller('url')
export class UrlController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private urlService: UrlService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  newrelic = require('newrelic');

  @Get(':shortUrl')
  async get(
    @Param('shortUrl') shortUrl: string,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const cachedData = await this.cacheManager.get(shortUrl);
    console.log('cachedData', cachedData);
    if (cachedData) {
      console.log('cachedData', cachedData);
      this.newrelic.recordCustomEvent('getUrl', {
        shortUrl: shortUrl,
        req: request,
      });
      const redirectUrl = /^https?\/\//.test(String(cachedData))
        ? `https://${cachedData}`
        : cachedData;
      res.redirect(String(redirectUrl));
    } else {
      console.log('obtenerurl');
      const url = await this.urlService.obtenerUrl(shortUrl);
      if (!url) {
        throw new NotFoundException('Url no encontrada');
      }
      const redirectUrl = /^https?\/\//.test(String(url.url))
        ? `https://${url.url}`
        : url.url;
      console.log(redirectUrl, 'redirectUrl');
      this.newrelic.recordCustomEvent('getUrl', {
        shortUrl: shortUrl,
        req: request,
      });
      res.redirect(String(redirectUrl));
    }
  }

  @Post()
  create(@Body() data: CreateUrlDto, @Req() request: Request) {
    //return { message: `Hello ${data.url}` };
    console.log(data);
    this.newrelic.recordCustomEvent('createUrl', {
      url: data,
      req: request,
    });
    return this.urlService.crearUrl(data);
  }

  @Delete(':shortUrl')
  delete(@Param('shortUrl') shortUrl: string, @Req() request: Request) {
    this.newrelic.recordCustomEvent('deleteUrl', {
      shortUrl: shortUrl,
      req: request,
    });
    this.urlService.deleteUrl(shortUrl);
    return { message: `Url ${shortUrl} eliminada` };
  }
}
