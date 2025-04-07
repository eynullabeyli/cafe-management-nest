import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class UpdateItemDto {
  @ApiPropertyOptional({ description: 'The name of the item' })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ description: 'The description of the item' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ description: 'The price of the item' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly price?: number;

  @ApiPropertyOptional({ description: 'The unique identifier of the category this item belongs to' })
  @IsString()
  @IsOptional()
  readonly categoryUniqId?: string;

  @ApiPropertyOptional({ description: 'The URL of the item image' })
  @IsString()
  @IsOptional()
  readonly imageUrl?: string;

  @ApiPropertyOptional({ description: 'Whether the item is new or not' })
  @IsBoolean()
  @IsOptional()
  readonly isNew?: boolean;

  @ApiPropertyOptional({ description: 'Whether the item is active or not' })
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
}