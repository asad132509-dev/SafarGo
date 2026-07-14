import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDriverDto {
  @ApiProperty({ description: 'License expiry date', required: false })
  @IsOptional()
  @IsString()
  licenseExpiryDate?: string;

  @ApiProperty({ description: 'Bank name', required: false })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({ description: 'Account holder name', required: false })
  @IsOptional()
  @IsString()
  accountHolderName?: string;

  @ApiProperty({ description: 'Years of experience', required: false })
  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;
}
