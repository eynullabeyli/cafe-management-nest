import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'The name of the category' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'The unique identifier for the category' })
  @IsString()
  @IsNotEmpty()
  readonly uniqId: string;

  @ApiPropertyOptional({ description: 'Whether the category is active or not', default: true })
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
}