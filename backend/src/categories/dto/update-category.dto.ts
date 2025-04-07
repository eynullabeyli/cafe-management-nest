import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'The name of the category' })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ description: 'Whether the category is active or not' })
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
}