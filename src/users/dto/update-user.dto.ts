import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiProperty({
    example: 'Password123',
    description: 'The password of the user',
    required: false,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  readonly password?: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'The address of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly address?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly phone?: string;
}
