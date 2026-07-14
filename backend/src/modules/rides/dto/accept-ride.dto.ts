import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptRideDto {
  @ApiProperty({ description: 'Driver ID' })
  @IsString()
  driverId: string;
}
