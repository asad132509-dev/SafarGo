import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRideDto {
  @ApiProperty({ description: 'Actual fare', required: false })
  @IsOptional()
  @IsNumber()
  actualFare?: number;

  @ApiProperty({ description: 'Actual duration in minutes', required: false })
  @IsOptional()
  @IsNumber()
  actualDurationMinutes?: number;
}
