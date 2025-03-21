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
        try {
            const createdItem = new this.itemModel(createItemDto);
            return await createdItem.save();
        }
        catch (error) {
            this.handleDatabaseError(error, 'create item');
        }
    }
    async findAll(options = {}) {
        this.checkDbConnectionStatus();
        const { limit = 10, skip = 0, activeOnly = false } = options;
        try {
            let query = this.itemModel.find();
            if (activeOnly) {
                query = query.where('isActive').equals(true);
            }
            return await query.limit(limit).skip(skip).exec();
        }
        catch (error) {
            this.handleDatabaseError(error, 'find all items');
        }
    }
    async findOne(id) {
        this.checkDbConnectionStatus();
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
            this.handleDatabaseError(error, `find item ${id}`);
        }
    }
    async findByCategory(categoryUniqId, activeOnly = false) {
        this.checkDbConnectionStatus();
        try {
            let query = this.itemModel.find({ categoryUniqId });
            if (activeOnly) {
                query = query.where('isActive').equals(true);
            }
            return await query.exec();
        }
        catch (error) {
            this.handleDatabaseError(error, `find items by category ${categoryUniqId}`);
        }
    }
    async searchByName(nameQuery, options = {}) {
        this.checkDbConnectionStatus();
        const { limit = 10, skip = 0, activeOnly = false } = options;
        try {
            const nameRegex = new RegExp(nameQuery, 'i');
            let query = this.itemModel.find({ name: nameRegex });
            if (activeOnly) {
                query = query.where('isActive').equals(true);
            }
            return await query.limit(limit).skip(skip).exec();
        }
        catch (error) {
            this.handleDatabaseError(error, `search items by name containing '${nameQuery}'`);
        }
    }
    async update(id, updateItemDto) {
        this.checkDbConnectionStatus();
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
            this.handleDatabaseError(error, `update item ${id}`);
        }
    }
    async remove(id) {
        this.checkDbConnectionStatus();
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
            this.handleDatabaseError(error, `delete item ${id}`);
        }
    }
    checkDbConnectionStatus() {
        if (!this.isDbConnected) {
            this.logger.error('Database operation attempted but database is not connected');
            throw new common_1.ServiceUnavailableException('Database connection is currently unavailable. Please try again later or contact support.');
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