import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { Cache } from 'cache-manager';

import { Url } from '../entities/url.entity';
import { CreateUrlDto } from '../dtos/url.dtos';
import { UrlExceptions } from '.././httpErrors/urlExceptions';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<Url>,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async obtenerUrl(shortUrl: string) {
    console.log('obtenerUrl', shortUrl);
    const url = await this.urlModel
      .findOneAndUpdate(
        { shortUrl: shortUrl },
        { $inc: { count: 1 } },
        { new: true },
      )
      .exec();
    console.log(url, 'url');
    if (!url) {
      throw new NotFoundException('Url no encontrada');
    }
    await this.cacheService.set(url.shortUrl, url.url);
    return url;
  }
  private generarClave(url: string): string {
    const hash = createHash('sha256');
    hash.update(url);
    return hash.digest('hex');
  }

  private generarShortUrl(clave: string, longitud: number): string {
    return clave.substring(0, longitud);
  }
  async crearUrl(data: CreateUrlDto) {
    try {
      const clave = this.generarClave(data.url);
      const shortUrl = this.generarShortUrl(clave, 6);
      const urlFind = data.url;
      // Verificar si la shortUrl ya existe en la base de datos
      const existe = await this.urlModel.find({ shortUrl }).exec();
      if (existe[0]) {
        await this.cacheService.set(shortUrl, urlFind);
        return existe;
      }

      const newUrl = {
        url: data.url,
        shortUrl: shortUrl,
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const url = new this.urlModel(newUrl);
      await url.save();
      await this.cacheService.set(url.shortUrl, url.url);
      return newUrl;
    } catch (error) {
      throw new UrlExceptions('Error al crear la url', error);
    }
  }

  async deleteUrl(shortUrl: string) {
    console.log(shortUrl, 'Service');
    await this.urlModel.find({ shortUrl: shortUrl }).exec();
    const url = await this.urlModel.find({ shortUrl: shortUrl }).exec();
    if (!url || url.length === 0 || url === undefined) {
      throw new UrlExceptions('Url no encontrada');
    }
    await this.urlModel.findByIdAndDelete(url[0].id).exec();
  }
}
