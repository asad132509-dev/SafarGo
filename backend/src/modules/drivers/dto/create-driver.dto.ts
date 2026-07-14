import { IsString, IsOptional, IsDate, IsUrl, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDto {
  userId?: string;

  @ApiProperty({ description: 'Passport number' })
  @IsString()
  passportNumber: string;

  @ApiProperty({ description: 'Passport image URL' })
  @IsUrl()
  passportImageUrl: string;

  @ApiProperty({ description: 'Selfie image URL' })
  @IsUrl()
  selfieUrl: string;

  @ApiProperty({ description: 'License number' })
  @IsString()
  licenseNumber: string;

  @ApiProperty({ description: 'License image URL' })
  @IsUrl()
  licenseImageUrl: string;

  @ApiProperty({ description: 'Years of experience', required: false })
  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @ApiProperty({ description: 'Bank account number', required: false })
  @IsOptional()
  @IsString()
  bankAccountNumber?: string;
}
