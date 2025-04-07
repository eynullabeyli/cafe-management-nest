"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ItemsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const item_schema_1 = require("./schemas/item.schema");
let ItemsService = ItemsService_1 = class ItemsService {
    constructor(itemModel) {
        this.itemModel = itemModel;
        this.logger = new common_1.Logger(ItemsService_1.name);
        this.isDbConnected = false;
        if (!this.itemModel) {
            this.isDbConnected = false;
            this.logger.warn('MongoDB model is not available. Database operations will not work.');
            this.logger.warn('The application will run with limited functionality.');
        }
        else {
            this.checkDbConnection();
        }
    }
    async checkDbConnection() {
        if (!this.itemModel || !this.itemModel.db) {
            this.isDbConnected = false;
            this.logger.error('Database model is not properly initialized');
            return;
        }
        try {
            await this.itemModel.db.db.command({ ping: 1 });
            this.isDbConnected = true;
            this.logger.log('MongoDB connection is available for Items service');
        }
        catch (error) {
            this.isDbConnected = false;
            this.logger.error(`MongoDB connection failed for Items service: ${error.message}`);
        }
    }
    async create(createItemDto) {
        this.checkDbConnectionStatus();
        if (!this.isDbConnected) {
            this.logger.warn(`Database not connected. Create operations are not available in fallback mode.`);
            throw new common_1.ServiceUnavailableException('Database connection is required for creating new items. Please try again later when database connectivity is restored.');
        }
        try {
            const createdItem = new this.itemModel(createItemDto);
            return await createdItem.save();
        }
        catch (error) {
            this.logger.error(`Error in create: ${error.message}`);
            throw new common_1.ServiceUnavailableException('An error occurred while creating the item. Please try again later or contact support.');
        }
    }
    async findAll(options = {}) {
        const { limit = 10, skip = 0, activeOnly = false } = options;
        this.checkDbConnectionStatus();
        if (!this.isDbConnected) {
            this.logger.warn('Database not connected. Returning sample items data.');
            let items = this.getSampleItems();
            if (activeOnly) {
                items = items.filter(item => item.isActive);
            }
            return items.slice(skip, skip + limit);
        }
        try {
            let query = this.itemModel.find();
            if (activeOnly) {
                query = query.where('isActive').equals(true);
            }
            return await query.limit(limit).skip(skip).exec();
        }
        catch (error) {
            this.logger.error(`Error in findAll items: ${error.message}`);
            let items = this.getSampleItems();
            if (activeOnly) {
                items = items.filter(item => item.isActive);
            }
            return items.slice(skip, skip + limit);
        }
    }
    async findOne(id) {
        this.checkDbConnectionStatus();
        if (!this.isDbConnected) {
            this.logger.warn(`Database not connected. Finding sample item with ID: ${id}`);
            const sampleItem = this.getSampleItems().find(item => item._id === id);
            if (!sampleItem) {
                throw new common_1.NotFoundException(`Item with ID ${id} not found`);
            }
            return sampleItem;
        }
        try {
            const item = await this.itemModel.findById(id).exec();
            if (!item) {
                throw new common_1.NotFoundException(`Item with ID ${id} not found`);
            }
            return item;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error in findOne: ${error.message}`);
            const sampleItem = this.getSampleItems().find(item => item._id === id);
            if (!sampleItem) {
                throw new common_1.NotFoundException(`Item with ID ${id} not found`);
            }
            return sampleItem;
        }
    }
    async findByCategory(categoryUniqId, activeOnly = false) {
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
        }
        catch (error) {
            this.logger.error(`Error in findByCategory: ${error.message}`);
            let items = this.getSampleItems().filter(item => item.categoryUniqId === categoryUniqId);
            if (activeOnly) {
                items = items.filter(item => item.isActive);
            }
            return items;
        }
    }
    async searchByName(nameQuery, options = {}) {
        this.checkDbConnectionStatus();
        const { limit = 10, skip = 0, activeOnly = false } = options;
        if (!this.isDbConnected) {
            this.logger.warn(`Database not connected. Searching sample items by name: ${nameQuery}`);
            const nameRegex = new RegExp(nameQuery, 'i');
            let items = this.getSampleItems().filter(item => nameRegex.test(item.name));
            if (activeOnly) {
                items = items.filter(item => item.isActive);
            }
            return items.slice(skip, skip + limit);
        }
        try {
            const nameRegex = new RegExp(nameQuery, 'i');
            let query = this.itemModel.find({ name: nameRegex });
            if (activeOnly) {
                query = query.where('isActive').equals(true);
            }
            return await query.limit(limit).skip(skip).exec();
        }
        catch (error) {
            this.logger.error(`Error in searchByName: ${error.message}`);
            const nameRegex = new RegExp(nameQuery, 'i');
            let items = this.getSampleItems().filter(item => nameRegex.test(item.name));
            if (activeOnly) {
                items = items.filter(item => item.isActive);
            }
            return items.slice(skip, skip + limit);
        }
    }
    async update(id, updateItemDto) {
        this.checkDbConnectionStatus();
        if (!this.isDbConnected) {
            this.logger.warn(`Database not connected. Update operations are not available in fallback mode.`);
            throw new common_1.ServiceUnavailableException('Database connection is required for update operations. Please try again later when database connectivity is restored.');
        }
        try {
            const updatedItem = await this.itemModel
                .findByIdAndUpdate(id, updateItemDto, { new: true })
                .exec();
            if (!updatedItem) {
                throw new common_1.NotFoundException(`Item with ID ${id} not found`);
            }
            return updatedItem;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error in update: ${error.message}`);
            throw new common_1.ServiceUnavailableException('An error occurred while updating the item. Please try again later or contact support.');
        }
    }
    async remove(id) {
        this.checkDbConnectionStatus();
        if (!this.isDbConnected) {
            this.logger.warn(`Database not connected. Delete operations are not available in fallback mode.`);
            throw new common_1.ServiceUnavailableException('Database connection is required for delete operations. Please try again later when database connectivity is restored.');
        }
        try {
            const deletedItem = await this.itemModel.findByIdAndDelete(id).exec();
            if (!deletedItem) {
                throw new common_1.NotFoundException(`Item with ID ${id} not found`);
            }
            return deletedItem;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error in remove: ${error.message}`);
            throw new common_1.ServiceUnavailableException('An error occurred while deleting the item. Please try again later or contact support.');
        }
    }
    getSampleItems() {
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
    checkDbConnectionStatus() {
        if (!this.isDbConnected) {
            this.logger.warn('Database is not connected. Using fallback sample data.');
        }
    }
    handleDatabaseError(error, operation) {
        this.logger.error(`Database error during ${operation}: ${error.message}`, error.stack);
        throw new common_1.ServiceUnavailableException('An error occurred while accessing the database. Please try again later or contact support.');
    }
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = ItemsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, mongoose_1.InjectModel)(item_schema_1.Item.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ItemsService);
//# sourceMappingURL=items.service.js.map