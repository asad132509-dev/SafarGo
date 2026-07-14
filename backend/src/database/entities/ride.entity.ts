import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * Ride Entity
 * Represents individual rides (trips)
 */
@Entity('rides')
@Index(['passengerId'])
@Index(['driverId'])
@Index(['status'])
@Index(['createdAt'])
export class Ride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  passengerId: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({ type: 'geography' })
  pickupLocation: string;

  @Column({ type: 'geography' })
  dropoffLocation: string;

  @Column({ length: 500 })
  pickupAddress: string;

  @Column({ length: 500 })
  dropoffAddress: string;

  @Column({ type: 'jsonb', nullable: true })
  pickupCoordinates: any;

  @Column({ type: 'jsonb', nullable: true })
  dropoffCoordinates: any;

  @Column({ type: 'enum', enum: ['REQUESTED', 'ACCEPTED', 'DRIVER_ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'REQUESTED' })
  status: string;

  @Column({ type: 'enum', enum: ['ECONOMY', 'COMFORT', 'PREMIUM'], default: 'ECONOMY' })
  rideType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distanceKm: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedFare: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualFare: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tipAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalFare: number;

  @Column({ type: 'enum', enum: ['CASH', 'CARD', 'WALLET', 'UZCARD', 'HUMO', 'CLICK', 'PAYME'] })
  paymentMethod: string;

  @Column({ type: 'enum', enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'], default: 'PENDING' })
  paymentStatus: string;

  @Column({ nullable: true })
  promoCodeId: string;

  @Column({ nullable: true, type: 'timestamp' })
  requestedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  acceptedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  arrivedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  pickupTime: Date;

  @Column({ nullable: true, type: 'timestamp' })
  dropoffTime: Date;

  @Column({ nullable: true })
  estimatedDurationMinutes: number;

  @Column({ nullable: true })
  actualDurationMinutes: number;

  @Column({ nullable: true, type: 'text' })
  cancellationReason: string;

  @Column({ type: 'enum', enum: ['PASSENGER', 'DRIVER', 'SYSTEM'], nullable: true })
  cancelledBy: string;

  @Column({ nullable: true, type: 'timestamp' })
  cancelledAt: Date;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ default: false })
  isShared: boolean;

  @Column({ nullable: true })
  sharedWithPassengerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
