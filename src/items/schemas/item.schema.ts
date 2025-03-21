import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @ApiProperty({ description: 'The MongoDB id of the item (optional in request body)' })
  _id?: string;

  @ApiProperty({ description: 'The name of the item' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'The description of the item' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'The price of the item' })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ description: 'The unique identifier of the category this item belongs to' })
  @Prop({ required: true })
  categoryUniqId: string;

  @ApiProperty({ description: 'The URL of the item image' })
  @Prop({ default: '' })
  imageUrl: string;

  @ApiProperty({ description: 'Whether the item is new or not' })
  @Prop({ default: false })
  isNew: boolean;

  @ApiProperty({ description: 'Whether the item is active or not' })
  @Prop({ default: true })
  isActive: boolean;
}

export const ItemSchema = SchemaFactory.createForClass(Item);