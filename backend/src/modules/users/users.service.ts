import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Users Service
 * Handles user creation, retrieval, updates, and OTP management
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Create new user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user: ${createUserDto.phoneNumber}`);

    const user = this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(user);

    this.logger.log(`User created: ${savedUser.id}`);
    return savedUser;
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  /**
   * Find user by phone number
   */
  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phoneNumber } });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Get all users (paginated)
   */
  async findAll(page: number = 1, limit: number = 20) {
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update user
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user: ${id}`);

    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...updateUserDto,
    });

    this.logger.log(`User updated: ${id}`);
    return updatedUser;
  }

  /**
   * Delete user (soft delete)
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting user: ${id}`);

    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.softDelete(id);
    this.logger.log(`User deleted: ${id}`);
  }

  /**
   * Set OTP code and expiration
   */
  async setOTP(userId: string, otp: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // Expire in 5 minutes

    await this.usersRepository.update(userId, {
      otpCode: otp,
      otpExpiresAt: expiresAt,
    });
  }

  /**
   * Mark user as verified
   */
  async markAsVerified(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      isVerified: true,
      otpCode: null,
      otpExpiresAt: null,
    });
  }

  /**
   * Update last login time
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }

  /**
   * Block/Unblock user
   */
  async toggleActive(userId: string, isActive: boolean): Promise<User> {
    this.logger.log(`${isActive ? 'Activating' : 'Blocking'} user: ${userId}`);

    return this.usersRepository.save({
      id: userId,
      isActive,
    });
  }
}
