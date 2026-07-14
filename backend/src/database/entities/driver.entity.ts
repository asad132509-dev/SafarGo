import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, OneToOne, Index } from 'typeorm';
import { User } from './user.entity';

/**
 * Driver Entity
 * Represents taxi drivers with verification and vehicle info
 */
@Entity('drivers')
@Index(['userId'])
@Index(['isOnline'])
@Index(['rating'])
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ unique: true, length: 20 })
  passportNumber: string;

  @Column({ nullable: true, type: 'date' })
  passportIssueDate: Date;

  @Column({ nullable: true, type: 'date' })
  passportExpiryDate: Date;

  @Column({ type: 'text' })
  passportImageUrl: string;

  @Column({ nullable: true, length: 64 })
  passportImageSha256: string;

  @Column({ type: 'text' })
  selfieUrl: string;

  @Column({ nullable: true, length: 64 })
  selfieImageSha256: string;

  @Column({ unique: true, length: 20 })
  licenseNumber: string;

  @Column({ nullable: true, type: 'date' })
  licenseIssueDate: Date;

  @Column({ nullable: true, type: 'date' })
  licenseExpiryDate: Date;

  @Column({ type: 'text' })
  licenseImageUrl: string;

  @Column({ nullable: true, length: 64 })
  licenseImageSha256: string;

  @Column({ nullable: true, length: 50 })
  techPassportNumber: string;

  @Column({ nullable: true, type: 'text' })
  techPassportImageUrl: string;

  @Column({ nullable: true, type: 'date' })
  techPassportExpiresAt: Date;

  @Column({ nullable: true })
  vehicleId: string;

  @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'], default: 'PENDING' })
  verificationStatus: string;

  @Column({ nullable: true, type: 'text' })
  rejectionReason: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ nullable: true, type: 'geography' })
  currentLocation: string;

  @Column({ nullable: true, type: 'timestamp' })
  locationUpdatedAt: Date;

  @Column({ default: 0 })
  totalRides: number;

  @Column({ default: 0 })
  totalCompleted: number;

  @Column({ default: 0 })
  totalCancelled: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  rating: number;

  @Column({ default: 0 })
  totalRatings: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  cancellationRate: number;

  @Column({ nullable: true })
  responseTimeSeconds: number;

  @Column({ nullable: true })
  yearsOfExperience: number;

  @Column({ nullable: true, length: 50 })
  bankAccountNumber: string;

  @Column({ nullable: true, length: 100 })
  bankName: string;

  @Column({ nullable: true, length: 255 })
  accountHolderName: string;

  @Column({ default: false })
  isPreferred: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  documentVerifiedAt: Date;

  @Column({ nullable: true })
  verifiedByAdminId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
