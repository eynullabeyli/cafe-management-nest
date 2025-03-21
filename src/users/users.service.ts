import { Injectable, Logger, NotFoundException, ServiceUnavailableException, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private isDbConnected = false;

  constructor(
    @Optional() @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    // Check if userModel is available (database module loaded correctly)
    if (!this.userModel) {
      this.isDbConnected = false;
      this.logger.warn('MongoDB model is not available. Database operations will not work.');
      this.logger.warn('The application will run with limited functionality.');
    } else {
      // Check database connection on service initialization
      this.checkDbConnection();
    }
  }

  private async checkDbConnection(): Promise<void> {
    // If userModel is not defined, we can't check the connection
    if (!this.userModel || !this.userModel.db) {
      this.isDbConnected = false;
      this.logger.error('Database model is not properly initialized');
      return;
    }
    
    try {
      // Try to ping the database with a short timeout
      await this.userModel.db.db.command({ ping: 1 });
      this.isDbConnected = true;
      this.logger.log('MongoDB connection is available');
    } catch (error) {
      this.isDbConnected = false;
      this.logger.error(`MongoDB connection failed: ${error.message}`);
      this.logger.warn('API will run with limited functionality - database operations will not be available');
      
      // Log specific error details for common issues
      if (error.message.includes('SSL') || error.message.includes('TLS')) {
        this.logger.error('SSL/TLS connection error detected. This might be due to TLS certificate validation issues.');
        this.logger.warn('Ensure MongoDB Atlas configuration allows modern TLS connections.');
      } else if (error.message.includes('whitelist') || error.message.includes('IP address')) {
        this.logger.error('IP whitelist error detected. Replit IP is not whitelisted in MongoDB Atlas.');
        this.logger.warn('Add 0.0.0.0/0 to your MongoDB Atlas IP whitelist to allow connections from anywhere.');
      } else if (error.message.includes('authentication') || error.message.includes('auth')) {
        this.logger.error('Authentication error detected. Credentials in the connection string may be incorrect.');
      } else if (error.message.includes('timeout')) {
        this.logger.error('Connection timeout. Network issues or firewall restrictions may be preventing connection.');
      }
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.checkDbConnectionStatus();
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      this.handleDatabaseError(error, 'create user');
    }
  }

  async findAll(options: { limit?: number; skip?: number } = {}): Promise<User[]> {
    this.checkDbConnectionStatus();
    try {
      const { limit = 10, skip = 0 } = options;
      return await this.userModel.find().limit(limit).skip(skip).exec();
    } catch (error) {
      this.handleDatabaseError(error, 'find all users');
    }
  }

  async findOne(id: string): Promise<User> {
    this.checkDbConnectionStatus();
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseError(error, `find user ${id}`);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.checkDbConnectionStatus();
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseError(error, `update user ${id}`);
    }
  }

  async remove(id: string): Promise<User> {
    this.checkDbConnectionStatus();
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return deletedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseError(error, `delete user ${id}`);
    }
  }
  
  private checkDbConnectionStatus(): void {
    if (!this.isDbConnected) {
      this.logger.error('Database operation attempted but database is not connected');
      throw new ServiceUnavailableException(
        'Database connection is currently unavailable. Please try again later or contact support.'
      );
    }
  }
  
  private handleDatabaseError(error: any, operation: string): never {
    this.logger.error(`Database error during ${operation}: ${error.message}`, error.stack);
    throw new ServiceUnavailableException(
      'An error occurred while accessing the database. Please try again later or contact support.'
    );
  }
}
