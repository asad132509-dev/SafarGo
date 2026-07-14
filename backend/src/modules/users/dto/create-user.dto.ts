import { IsString, IsOptional, IsEmail, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Phone number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'Password hash' })
  @IsString()
  passwordHash: string;

  @ApiProperty({ description: 'Full name', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ description: 'User role', enum: ['PASSENGER', 'DRIVER', 'ADMIN'] })
  @IsString()
  role: string;
}
