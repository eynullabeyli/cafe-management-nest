import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ description: 'The name of the item' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'The description of the item' })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ description: 'The price of the item' })
  @IsNumber()
  @Min(0)
  readonly price: number;

  @ApiProperty({ description: 'The unique identifier of the category this item belongs to' })
  @IsString()
  @IsNotEmpty()
  readonly categoryUniqId: string;

  @ApiPropertyOptional({ description: 'The URL of the item image' })
  @IsString()
  @IsOptional()
  readonly imageUrl?: string;

  @ApiPropertyOptional({ description: 'Whether the item is new or not', default: false })
  @IsBoolean()
  @IsOptional()
  readonly isNew?: boolean;

  @ApiPropertyOptional({ description: 'Whether the item is active or not', default: true })
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
}