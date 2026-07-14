import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from '../../database/entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

/**
 * Drivers Service
 * Handles driver registration, verification, and document management
 */
@Injectable()
export class DriversService {
  private readonly logger = new Logger('DriversService');

  constructor(
    @InjectRepository(Driver)
    private readonly driversRepository: Repository<Driver>,
  ) {}

  /**
   * Create driver profile
   */
  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    this.logger.log(`Creating driver profile: ${createDriverDto.userId}`);

    // Check if driver already exists
    const existingDriver = await this.driversRepository.findOne({
      where: { userId: createDriverDto.userId },
    });

    if (existingDriver) {
      throw new BadRequestException('Driver profile already exists');
    }

    const driver = this.driversRepository.create(createDriverDto);
    const savedDriver = await this.driversRepository.save(driver);

    this.logger.log(`Driver profile created: ${savedDriver.id}`);
    return savedDriver;
  }

  /**
   * Find driver by ID
   */
  async findById(id: string): Promise<Driver | null> {
    return this.driversRepository.findOne({ where: { id } });
  }

  /**
   * Find driver by user ID
   */
  async findByUserId(userId: string): Promise<Driver | null> {
    return this.driversRepository.findOne({ where: { userId } });
  }

  /**
   * Find driver by license number
   */
  async findByLicenseNumber(licenseNumber: string): Promise<Driver | null> {
    return this.driversRepository.findOne({ where: { licenseNumber } });
  }

  /**
   * Get all drivers (paginated)
   */
  async findAll(page: number = 1, limit: number = 20, filters?: any) {
    const query = this.driversRepository.createQueryBuilder('driver');

    if (filters?.verificationStatus) {
      query.andWhere('driver.verificationStatus = :status', { status: filters.verificationStatus });
    }

    if (filters?.isOnline !== undefined) {
      query.andWhere('driver.isOnline = :isOnline', { isOnline: filters.isOnline });
    }

    const [drivers, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('driver.rating', 'DESC')
      .getManyAndCount();

    return {
      data: drivers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update driver profile
   */
  async update(id: string, updateDriverDto: UpdateDriverDto): Promise<Driver> {
    this.logger.log(`Updating driver: ${id}`);

    const driver = await this.findById(id);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const updatedDriver = await this.driversRepository.save({
      ...driver,
      ...updateDriverDto,
    });

    this.logger.log(`Driver updated: ${id}`);
    return updatedDriver;
  }

  /**
   * Verify driver (admin operation)
   */
  async verifyDriver(id: string, adminId: string): Promise<Driver> {
    this.logger.log(`Verifying driver: ${id} by admin: ${adminId}`);

    return this.driversRepository.save({
      id,
      verificationStatus: 'APPROVED',
      documentVerifiedAt: new Date(),
      verifiedByAdminId: adminId,
    });
  }

  /**
   * Reject driver (admin operation)
   */
  async rejectDriver(id: string, adminId: string, reason: string): Promise<Driver> {
    this.logger.log(`Rejecting driver: ${id} by admin: ${adminId}`);

    return this.driversRepository.save({
      id,
      verificationStatus: 'REJECTED',
      rejectionReason: reason,
      verifiedByAdminId: adminId,
    });
  }

  /**
   * Set driver online status
   */
  async setOnlineStatus(driverId: string, isOnline: boolean): Promise<Driver> {
    this.logger.log(`Setting driver ${driverId} online status: ${isOnline}`);

    return this.driversRepository.save({
      id: driverId,
      isOnline,
      locationUpdatedAt: new Date(),
    });
  }

  /**
   * Update driver location
   */
  async updateLocation(driverId: string, latitude: number, longitude: number): Promise<Driver> {
    return this.driversRepository.save({
      id: driverId,
      currentLocation: `POINT(${longitude} ${latitude})`,
      locationUpdatedAt: new Date(),
    });
  }

  /**
   * Update driver rating
   */
  async updateRating(driverId: string, newRating: number): Promise<Driver> {
    const driver = await this.findById(driverId);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const totalRatings = driver.totalRatings + 1;
    const rating = (driver.rating * driver.totalRatings + newRating) / totalRatings;

    return this.driversRepository.save({
      id: driverId,
      rating: Math.round(rating * 100) / 100,
      totalRatings,
    });
  }

  /**
   * Get online drivers near location (for ride matching)
   */
  async findOnlineDriversNearLocation(latitude: number, longitude: number, radiusKm: number = 5) {
    const query = this.driversRepository
      .createQueryBuilder('driver')
      .where('driver.isOnline = true')
      .andWhere('driver.isActive = true')
      .andWhere('driver.verificationStatus = :status', { status: 'APPROVED' })
      .orderBy(
        `ST_Distance(
          ST_GeogFromText('POINT(' || driver.currentLocation || ')'),
          ST_GeogFromText('POINT(${longitude} ${latitude})')
        )`,
        'ASC',
      )
      .limit(10);

    return query.getMany();
  }
}
