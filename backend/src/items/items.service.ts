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
    
    if (!this.isDbConnected) {
      this.logger.warn(`Database not connected. Create operations are not available in fallback mode.`);
      throw new ServiceUnavailableException(
        'Database connection is required for creating new items. Please try again later when database connectivity is restored.'
      );
    }
    
    try {
      const createdItem = new this.itemModel(createItemDto);
      return await createdItem.save();
    } catch (error) {
      this.logger.error(`Error in create: ${error.message}`);
      throw new ServiceUnavailableException(
        'An error occurred while creating the item. Please try again later or contact support.'
      );
    }
  }

  async findAll(options: { limit?: number; skip?: number; activeOnly?: boolean } = {}): Promise<Item[]> {
    const { limit = 10, skip = 0, activeOnly = false } = options;
    
    this.checkDbConnectionStatus();
    
    if (!this.isDbConnected) {
      this.logger.warn('Database not connected. Returning sample items data.');
      let items = this.getSampleItems();
      
      // Apply active filter if needed
      if (activeOnly) {
        items = items.filter(item => item.isActive);
      }
      
      // Apply pagination
      return items.slice(skip, skip + limit);
    }
    
    try {
      let query = this.itemModel.find();
      
      if (activeOnly) {
        query = query.where('isActive').equals(true);
      }
      
      return await query.limit(limit).skip(skip).exec();
    } catch (error) {
      this.logger.error(`Error in findAll items: ${error.message}`);
      let items = this.getSampleItems();
      
      if (activeOnly) {
        items = items.filter(item => item.isActive);
      }
      
      return items.slice(skip, skip + limit);
    }
  }

  async findOne(id: string): Promise<Item> {
    this.checkDbConnectionStatus();
    
    if (!this.isDbConnected) {
      this.logger.warn(`Database not connected. Finding sample item with ID: ${id}`);
      const sampleItem = this.getSampleItems().find(item => item._id === id);
      
      if (!sampleItem) {
        throw new NotFoundException(`Item with ID ${id} not found`);
      }
      
      return sampleItem;
    }
    
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
      
      this.logger.error(`Error in findOne: ${error.message}`);
      
      // Try to find in sample data as fallback
      const sampleItem = this.getSampleItems().find(item => item._id === id);
      
      if (!sampleItem) {
        throw new NotFoundException(`Item with ID ${id} not found`);
      }
      
      return sampleItem;
    }
  }

  async findByCategory(categoryUniqId: string, activeOnly: boolean = false): Promise<Item[]> {
    this.checkDbConnectionStatus();
    
    if (!this.isDbConnected) {
      this.logger.warn(`Database not connected. Returning sample items for category ${categoryUniqId}`);
      let items = this.getSampleItems().filter(item => item.categoryUniqId === categoryUniqId);
      
      if (activeOnly) {
        items = items.filter(item => item.isActive);
      }
      
      return items;
    }
    
    try {
      let query = this.itemModel.find({ categoryUniqId });
      
      if (activeOnly) {
        query = query.where('isActive').equals(true);
      }
      
      return await query.exec();
    } catch (error) {
      this.logger.error(`Error in findByCategory: ${error.message}`);
      let items = this.getSampleItems().filter(item => item.categoryUniqId === categoryUniqId);
      
      if (activeOnly) {
        items = items.filter(item => item.isActive);
      }
      
      return items;
    }
  }

  async searchByName(nameQuery: string, options: { limit?: number; skip?: number; activeOnly?: boolean } = {}): Promise<Item[]> {
    this.checkDbConnectionStatus();
    const { limit = 10, skip = 0, activeOnly = false } = options;
    
    if (!this.isDbConnected) {
      this.logger.warn(`Database not connected. Searching sample items by name: ${nameQuery}`);
      // Create a case-insensitive regular expression for the name search
      const nameRegex = new RegExp(nameQuery, 'i');
      
      let items = this.getSampleItems().filter(item => nameRegex.test(item.name));
      
      if (activeOnly) {
        items = items.filter(item => item.isActive);
      }
      
      return items.slice(skip, skip + limit);
    }
    
    try {
      // Create a case-insensitive regular expression for the name search
      const nameRegex = new RegExp(nameQuery, 'i');
      
      let query = this.itemModel.find({ name: nameRegex });
      
      if (activeOnly) {
        query = query.where('isActive').equals(true);
      }
      
      return await query.limit(limit).skip(skip).exec();
    } catch (error) {
      this.logger.error(`Error in searchByName: ${error.message}`);
      
      // Fallback to sample data
      const nameRegex = new RegExp(nameQuery, 'i');
      let items = this.getSampleItems().filter(item => nameRegex.test(item.name));
      
      if (activeOnly) {
        items = items.filter(item => item.isActive);
      }
      
      return items.slice(skip, skip + limit);
    }
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    this.checkDbConnectionStatus();
    
    if (!this.isDbConnected) {
      this.logger.warn(`Database not connected. Update operations are not available in fallback mode.`);
      throw new ServiceUnavailableException(
        'Database connection is required for update operations. Please try again later when database connectivity is restored.'
      );
    }
    
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
      this.logger.error(`Error in update: ${error.message}`);
      throw new ServiceUnavailableException(
        'An error occurred while updating the item. Please try again later or contact support.'
      );
    }
  }

  async remove(id: string): Promise<Item> {
    this.checkDbConnectionStatus();
    
    if (!this.isDbConnected) {
      this.logger.warn(`Database not connected. Delete operations are not available in fallback mode.`);
      throw new ServiceUnavailableException(
        'Database connection is required for delete operations. Please try again later when database connectivity is restored.'
      );
    }
    
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
      this.logger.error(`Error in remove: ${error.message}`);
      throw new ServiceUnavailableException(
        'An error occurred while deleting the item. Please try again later or contact support.'
      );
    }
  }
  
  // Method to provide sample data when database is not available
  private getSampleItems(): Item[] {
    return [
      {
        _id: '1',
        name: 'Cappuccino',
        description: 'A classic Italian coffee drink with espresso, steamed milk, and a layer of frothed milk',
        price: 4.50,
        categoryUniqId: 'hot-drinks',
        imageUrl: 'https://picsum.photos/seed/cafe1/300/200',
        isNew: true,
        isActive: true,
      },
      {
        _id: '2',
        name: 'Iced Coffee',
        description: 'Chilled coffee served with ice cubes and optional milk or cream',
        price: 3.80,
        categoryUniqId: 'cold-drinks',
        imageUrl: 'https://picsum.photos/seed/cafe2/300/200',
        isNew: false,
        isActive: true,
      },
      {
        _id: '3',
        name: 'Chocolate Muffin',
        description: 'Freshly baked muffin with rich chocolate chips',
        price: 2.50,
        categoryUniqId: 'desserts',
        imageUrl: 'https://picsum.photos/seed/cafe3/300/200',
        isNew: false,
        isActive: true,
      },
      {
        _id: '4',
        name: 'Breakfast Sandwich',
        description: 'Egg, cheese and bacon on a toasted bagel',
        price: 5.20,
        categoryUniqId: 'breakfast',
        imageUrl: 'https://picsum.photos/seed/cafe4/300/200',
        isNew: false,
        isActive: false,
      },
    ];
  }
  
  private checkDbConnectionStatus(): void {
    // Instead of throwing an exception, just log a warning - fallback data will be used
    if (!this.isDbConnected) {
      this.logger.warn('Database is not connected. Using fallback sample data.');
    }
  }
  
  private handleDatabaseError(error: any, operation: string): never {
    this.logger.error(`Database error during ${operation}: ${error.message}`, error.stack);
    throw new ServiceUnavailableException(
      'An error occurred while accessing the database. Please try again later or contact support.'
    );
  }
}