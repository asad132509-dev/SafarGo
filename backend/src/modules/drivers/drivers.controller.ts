import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

/**
 * Drivers Controller
 * Handles driver registration, verification, and operations
 */
@ApiTags('Drivers')
@Controller('api/drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  /**
   * Create driver profile
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create driver profile' })
  async createDriver(@Request() req: any, @Body() createDriverDto: CreateDriverDto) {
    createDriverDto.userId = req.user.id;
    return this.driversService.create(createDriverDto);
  }

  /**
   * Get driver profile
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current driver profile' })
  async getProfile(@Request() req: any) {
    return this.driversService.findByUserId(req.user.id);
  }

  /**
   * Get driver by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get driver by ID' })
  async getDriver(@Param('id') id: string) {
    return this.driversService.findById(id);
  }

  /**
   * Get all drivers
   */
  @Get()
  @ApiOperation({ summary: 'Get all drivers' })
  async getAllDrivers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('verificationStatus') verificationStatus?: string,
  ) {
    return this.driversService.findAll(page, limit, { verificationStatus });
  }

  /**
   * Update driver profile
   */
  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update driver profile' })
  async updateDriver(@Request() req: any, @Body() updateDriverDto: UpdateDriverDto) {
    const driver = await this.driversService.findByUserId(req.user.id);
    return this.driversService.update(driver.id, updateDriverDto);
  }

  /**
   * Update driver online status
   */
  @Put(':id/online-status')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update driver online status' })
  async updateOnlineStatus(
    @Param('id') id: string,
    @Body('isOnline') isOnline: boolean,
  ) {
    return this.driversService.setOnlineStatus(id, isOnline);
  }

  /**
   * Update driver location (GPS)
   */
  @Put(':id/location')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update driver GPS location' })
  async updateLocation(
    @Param('id') id: string,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
  ) {
    return this.driversService.updateLocation(id, latitude, longitude);
  }

  /**
   * Get nearby online drivers
   */
  @Get('nearby')
  @ApiOperation({ summary: 'Get nearby online drivers' })
  async getNearbyDrivers(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number = 5,
  ) {
    return this.driversService.findOnlineDriversNearLocation(latitude, longitude, radius);
  }
}
