import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { AcceptRideDto } from './dto/accept-ride.dto';
import { CancelRideDto } from './dto/cancel-ride.dto';

/**
 * Rides Controller
 * Handles ride operations
 */
@ApiTags('Rides')
@Controller('api/rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  /**
   * Create new ride request
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create new ride request' })
  async createRide(@Request() req: any, @Body() createRideDto: CreateRideDto) {
    createRideDto.passengerId = req.user.id;
    return this.ridesService.create(createRideDto);
  }

  /**
   * Get ride details
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get ride details' })
  async getRide(@Param('id') id: string) {
    return this.ridesService.findById(id);
  }

  /**
   * Get passenger rides
   */
  @Get('passenger/rides')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get passenger rides' })
  async getPassengerRides(@Request() req: any, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.ridesService.getPassengerRides(req.user.id, page, limit);
  }

  /**
   * Get driver rides
   */
  @Get('driver/rides')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get driver rides' })
  async getDriverRides(@Request() req: any, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.ridesService.getDriverRides(req.user.id, page, limit);
  }

  /**
   * Accept ride
   */
  @Put(':id/accept')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Accept ride' })
  async acceptRide(@Param('id') id: string, @Request() req: any) {
    return this.ridesService.acceptRide(id, req.user.id);
  }

  /**
   * Mark driver arrived
   */
  @Put(':id/arrived')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Mark driver arrived' })
  async markArrived(@Param('id') id: string) {
    return this.ridesService.markDriverArrived(id);
  }

  /**
   * Start ride
   */
  @Put(':id/start')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Start ride' })
  async startRide(@Param('id') id: string) {
    return this.ridesService.startRide(id);
  }

  /**
   * Complete ride
   */
  @Put(':id/complete')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Complete ride' })
  async completeRide(@Param('id') id: string, @Body() updateRideDto: UpdateRideDto) {
    return this.ridesService.completeRide(id, updateRideDto);
  }

  /**
   * Cancel ride
   */
  @Put(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cancel ride' })
  async cancelRide(@Param('id') id: string, @Body() cancelRideDto: CancelRideDto) {
    return this.ridesService.cancelRide(id, cancelRideDto.cancelledBy, cancelRideDto.reason);
  }
}
