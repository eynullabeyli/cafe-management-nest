import { Injectable, Logger, NotFoundException, Optional, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from './schemas/item.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);
  private isDbConnected = false;

  constructor(
    @Optional() @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
  ) {
    // Check if itemModel is available
    if (!this.itemModel) {
      this.isDbConnected = false;
      this.logger.warn('MongoDB model is not available. Database operations will not work.');
      this.logger.warn('The application will run with limited functionality.');
    } else {
      // Check database connection on service initialization
      this.checkDbConnection();
    }
  }

  private async checkDbConnection(): Promise<void> {
    // If itemModel is not defined, we can't check the connection
    if (!this.itemModel || !this.itemModel.db) {
      this.isDbConnected = false;
      this.logger.error('Database model is not properly initialized');
      return;
    }
    
    try {
      // Try to ping the database with a short timeout
      await this.itemModel.db.db.command({ ping: 1 });
      this.isDbConnected = true;
      this.logger.log('MongoDB connection is available for Items service');
    } catch (error) {
      this.isDbConnected = false;
      this.logger.error(`MongoDB connection failed for Items service: ${error.message}`);
    }
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    this.checkDbConnectionStatus();
    try {
      const createdItem = new this.itemModel(createItemDto);
      return await createdItem.save();
    } catch (error) {
      this.handleDatabaseError(error, 'create item');
    }
  }

  async findAll(options: { limit?: number; skip?: number; activeOnly?: boolean } = {}): Promise<Item[]> {
    this.checkDbConnectionStatus();
    
    const { limit = 10, skip = 0, activeOnly = false } = options;
    
    try {
      let query = this.itemModel.find();
      
      if (activeOnly) {
        query = query.where('isActive').equals(true);
      }
      
      return await query.limit(limit).skip(skip).exec();
    } catch (error) {
      this.handleDatabaseError(error, 'find all items');
    }
  }

  async findOne(id: string): Promise<Item> {
    this.checkDbConnectionStatus();
    try {
      const item = await this.itemModel.findById(id).exec();
      if (!item) {
        throw new NotFoundException(`Item with ID ${id} not found`);
      }
      return item;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseError(error, `find item ${id}`);
    }
  }

  async findByCategory(categoryUniqId: string, activeOnly: boolean = false): Promise<Item[]> {
    this.checkDbConnectionStatus();
    try {
      let query = this.itemModel.find({ categoryUniqId });
      
      if (activeOnly) {
        query = query.where('isActive').equals(true);
      }
      
      return await query.exec();
    } catch (error) {
      this.handleDatabaseError(error, `find items by category ${categoryUniqId}`);
    }
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    this.checkDbConnectionStatus();
    try {
      const updatedItem = await this.itemModel
        .findByIdAndUpdate(id, updateItemDto, { new: true })
        .exec();
      if (!updatedItem) {
        throw new NotFoundException(`Item with ID ${id} not found`);
      }
      return updatedItem;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseError(error, `update item ${id}`);
    }
  }

  async remove(id: string): Promise<Item> {
    this.checkDbConnectionStatus();
    try {
      const deletedItem = await this.itemModel.findByIdAndDelete(id).exec();
      if (!deletedItem) {
        throw new NotFoundException(`Item with ID ${id} not found`);
      }
      return deletedItem;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseError(error, `delete item ${id}`);
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