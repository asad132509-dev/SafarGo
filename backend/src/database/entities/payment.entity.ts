import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * Payment Entity
 * Represents payment transactions
 */
@Entity('payments')
@Index(['rideId'])
@Index(['userId'])
@Index(['status'])
@Index(['createdAt'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rideId: string;

  @Column()
  userId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 3, default: 'UZS' })
  currency: string;

  @Column({ type: 'enum', enum: ['UZCARD', 'HUMO', 'CLICK', 'PAYME', 'UZUM', 'VISA', 'MASTERCARD', 'CASH'] })
  paymentMethod: string;

  @Column({ nullable: true, length: 50 })
  paymentGateway: string;

  @Column({ unique: true, nullable: true, length: 255 })
  transactionId: string;

  @Column({ nullable: true, length: 255 })
  merchantTransactionId: string;

  @Column({ type: 'enum', enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED'], default: 'PENDING' })
  status: string;

  @Column({ nullable: true, length: 50 })
  errorCode: string;

  @Column({ nullable: true, type: 'text' })
  errorMessage: string;

  @Column({ nullable: true, type: 'text' })
  receiptUrl: string;

  @Column({ nullable: true, length: 50 })
  receiptNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  commissionAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  platformFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  netAmount: number;

  @Column({ nullable: true, length: 255 })
  refundId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refundAmount: number;

  @Column({ nullable: true, type: 'text' })
  refundReason: string;

  @Column({ nullable: true, type: 'timestamp' })
  refundAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  paymentData: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  completedAt: Date;
}
