import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRideDto {
  passengerId?: string;

  @ApiProperty({ description: 'Pickup address' })
  @IsString()
  pickupAddress: string;

  @ApiProperty({ description: 'Dropoff address' })
  @IsString()
  dropoffAddress: string;

  @ApiProperty({ description: 'Pickup latitude' })
  @IsNumber()
  pickupLatitude: number;

  @ApiProperty({ description: 'Pickup longitude' })
  @IsNumber()
  pickupLongitude: number;

  @ApiProperty({ description: 'Dropoff latitude' })
  @IsNumber()
  dropoffLatitude: number;

  @ApiProperty({ description: 'Dropoff longitude' })
  @IsNumber()
  dropoffLongitude: number;

  @ApiProperty({ description: 'Ride type', enum: ['ECONOMY', 'COMFORT', 'PREMIUM'], required: false })
  @IsOptional()
  @IsEnum(['ECONOMY', 'COMFORT', 'PREMIUM'])
  rideType?: string;

  @ApiProperty({ description: 'Payment method' })
  @IsString()
  paymentMethod: string;
}
