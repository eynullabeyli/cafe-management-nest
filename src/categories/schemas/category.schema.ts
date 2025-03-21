import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @ApiProperty({ description: 'The name of the category' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'The unique identifier for the category' })
  @Prop({ required: true, unique: true })
  uniqId: string;

  @ApiProperty({ description: 'Whether the category is active or not' })
  @Prop({ default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);