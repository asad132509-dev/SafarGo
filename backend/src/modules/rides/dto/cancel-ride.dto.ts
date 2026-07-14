import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelRideDto {
  @ApiProperty({ description: 'Who cancelled the ride', enum: ['PASSENGER', 'DRIVER', 'SYSTEM'] })
  @IsEnum(['PASSENGER', 'DRIVER', 'SYSTEM'])
  cancelledBy: string;

  @ApiProperty({ description: 'Cancellation reason' })
  @IsString()
  reason: string;
}
