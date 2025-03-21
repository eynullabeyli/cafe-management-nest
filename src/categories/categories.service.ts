import { Injectable, Logger, NotFoundException, Optional, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  private isDbConnected = false;

  constructor(
    @Optional() @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {
    // Check if categoryModel is available
    if (!this.categoryModel) {
      this.isDbConnected = false;
      this.logger.warn('MongoDB model is not available. Database operations will not work.');
      this.logger.warn('The application will run with limited functionality.');
    } else {
      // Check database connection on service initialization
      this.checkDbConnection();
    }
  }

  private async checkDbConnection(): Promise<void> {
    // If categoryModel is not defined, we can't check the connection
    if (!this.categoryModel || !this.categoryModel.db) {
      this.isDbConnected = false;
      this.logger.error('Database model is not properly initialized');
      return;
    }
    
    try {
      // Try to ping the database with a short timeout
      await this.categoryModel.db.db.command({ ping: 1 });
      this.isDbConnected = true;
      this.logger.log('MongoDB connection is available for Categories service');
    } catch (error) {
      this.isDbConnected = false;
      this.logger.error(`MongoDB connection failed for Categories service: ${error.message}`);
    }
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    this.checkDbConnectionStatus();
    try {
      const createdCategory = new this.categoryModel(createCategoryDto);
      return await createdCategory.save();
    } catch (error) {
      this.handleDatabaseError(error, 'create category');
    }
  }

  async findAll(): Promise<Category[]> {
    this.checkDbConnectionStatus();
    try {
      return await this.categoryModel.find().exec();
    } catch (error) {
      this.handleDatabaseError(error, 'find all categories');
    }
  }

  async findAllActive(): Promise<Category[]> {
    this.checkDbConnectionStatus();
    try {
      return await this.categoryModel.find({ isActive: true }).exec();
    } catch (error) {
      this.handleDatabaseError(error, 'find all active categories');
    }
  }

  async findOne(id: string): Promise<Category> {
    this.checkDbConnectionStatus();
    try {
      const category = await this.categoryModel.findById(id).exec();
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseError(error, `find category ${id}`);
    }
  }

  async findByUniqId(uniqId: string): Promise<Category> {
    this.checkDbConnectionStatus();
    try {
      const category = await this.categoryModel.findOne({ uniqId }).exec();
      if (!category) {
        throw new NotFoundException(`Category with uniqId ${uniqId} not found`);
      }
      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseError(error, `find category with uniqId ${uniqId}`);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    this.checkDbConnectionStatus();
    try {
      const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(id, updateCategoryDto, { new: true })
        .exec();
      if (!updatedCategory) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return updatedCategory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseError(error, `update category ${id}`);
    }
  }

  async remove(id: string): Promise<Category> {
    this.checkDbConnectionStatus();
    try {
      const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();
      if (!deletedCategory) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return deletedCategory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseError(error, `delete category ${id}`);
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