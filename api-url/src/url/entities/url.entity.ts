import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Url extends Document {
  @Prop({ required: true })
  url: string;
  @Prop({ required: true, index: true, unique: true })
  shortUrl: string;
  @Prop({ required: true })
  estado: string;
  @Prop({ type: Number, default: 0 })
  count: number;
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
  @Prop({ type: Date, default: null })
  deletedAt: Date;
}
export const UrlSchema = SchemaFactory.createForClass(Url);
