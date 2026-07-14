import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride } from '../../database/entities/ride.entity';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';

/**
 * Rides Service
 * Handles ride creation, tracking, and status management
 */
@Injectable()
export class RidesService {
  private readonly logger = new Logger('RidesService');

  constructor(
    @InjectRepository(Ride)
    private readonly ridesRepository: Repository<Ride>,
  ) {}

  /**
   * Create new ride request
   */
  async create(createRideDto: CreateRideDto): Promise<Ride> {
    this.logger.log(`Creating ride request from ${createRideDto.pickupAddress}`);

    const ride = this.ridesRepository.create({
      ...createRideDto,
      status: 'REQUESTED',
      requestedAt: new Date(),
    });

    const savedRide = await this.ridesRepository.save(ride);
    this.logger.log(`Ride created: ${savedRide.id}`);
    return savedRide;
  }

  /**
   * Find ride by ID
   */
  async findById(id: string): Promise<Ride | null> {
    return this.ridesRepository.findOne({ where: { id } });
  }

  /**
   * Get passenger rides
   */
  async getPassengerRides(passengerId: string, page: number = 1, limit: number = 10) {
    const [rides, total] = await this.ridesRepository.findAndCount({
      where: { passengerId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: rides,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get driver rides
   */
  async getDriverRides(driverId: string, page: number = 1, limit: number = 10) {
    const [rides, total] = await this.ridesRepository.findAndCount({
      where: { driverId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: rides,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Accept ride (driver)
   */
  async acceptRide(rideId: string, driverId: string): Promise<Ride> {
    this.logger.log(`Driver ${driverId} accepted ride ${rideId}`);

    const ride = await this.findById(rideId);
    if (!ride) throw new NotFoundException('Ride not found');
    if (ride.status !== 'REQUESTED') throw new BadRequestException('Ride cannot be accepted');

    return this.ridesRepository.save({
      id: rideId,
      driverId,
      status: 'ACCEPTED',
      acceptedAt: new Date(),
    });
  }

  /**
   * Mark driver arrived
   */
  async markDriverArrived(rideId: string): Promise<Ride> {
    this.logger.log(`Driver arrived for ride ${rideId}`);

    return this.ridesRepository.save({
      id: rideId,
      status: 'DRIVER_ARRIVED',
      arrivedAt: new Date(),
    });
  }

  /**
   * Start ride
   */
  async startRide(rideId: string): Promise<Ride> {
    this.logger.log(`Starting ride ${rideId}`);

    return this.ridesRepository.save({
      id: rideId,
      status: 'IN_PROGRESS',
      pickupTime: new Date(),
    });
  }

  /**
   * Complete ride
   */
  async completeRide(rideId: string, updateRideDto: UpdateRideDto): Promise<Ride> {
    this.logger.log(`Completing ride ${rideId}`);

    const ride = await this.findById(rideId);
    if (!ride) throw new NotFoundException('Ride not found');

    const totalFare = (ride.actualFare || 0) - (ride.discountAmount || 0) + (ride.tipAmount || 0);

    return this.ridesRepository.save({
      id: rideId,
      status: 'COMPLETED',
      dropoffTime: new Date(),
      actualFare: updateRideDto.actualFare,
      actualDurationMinutes: updateRideDto.actualDurationMinutes,
      totalFare,
    });
  }

  /**
   * Cancel ride
   */
  async cancelRide(rideId: string, cancelledBy: string, reason: string): Promise<Ride> {
    this.logger.log(`Cancelling ride ${rideId} by ${cancelledBy}`);

    return this.ridesRepository.save({
      id: rideId,
      status: 'CANCELLED',
      cancelledBy,
      cancelledAt: new Date(),
      cancellationReason: reason,
    });
  }

  /**
   * Get ride statistics
   */
  async getRideStats(startDate: Date, endDate: Date) {
    const query = this.ridesRepository
      .createQueryBuilder('ride')
      .where('ride.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });

    const totalRides = await query.getCount();
    const completedRides = await query.clone().andWhere('ride.status = :status', { status: 'COMPLETED' }).getCount();
    const cancelledRides = await query.clone().andWhere('ride.status = :status', { status: 'CANCELLED' }).getCount();

    const avgFare = await query
      .clone()
      .select('AVG(ride.actualFare)', 'average')
      .getRawOne();

    return {
      totalRides,
      completedRides,
      cancelledRides,
      cancellationRate: ((cancelledRides / totalRides) * 100).toFixed(2),
      averageFare: avgFare?.average || 0,
    };
  }
}
