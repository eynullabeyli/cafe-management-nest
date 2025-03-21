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
var CategoriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_schema_1 = require("./schemas/category.schema");
let CategoriesService = CategoriesService_1 = class CategoriesService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
        this.logger = new common_1.Logger(CategoriesService_1.name);
        this.isDbConnected = false;
        if (!this.categoryModel) {
            this.isDbConnected = false;
            this.logger.warn('MongoDB model is not available. Database operations will not work.');
            this.logger.warn('The application will run with limited functionality.');
        }
        else {
            this.checkDbConnection();
        }
    }
    async checkDbConnection() {
        if (!this.categoryModel || !this.categoryModel.db) {
            this.isDbConnected = false;
            this.logger.error('Database model is not properly initialized');
            return;
        }
        try {
            await this.categoryModel.db.db.command({ ping: 1 });
            this.isDbConnected = true;
            this.logger.log('MongoDB connection is available for Categories service');
        }
        catch (error) {
            this.isDbConnected = false;
            this.logger.error(`MongoDB connection failed for Categories service: ${error.message}`);
        }
    }
    async create(createCategoryDto) {
        this.checkDbConnectionStatus();
        try {
            const createdCategory = new this.categoryModel(createCategoryDto);
            return await createdCategory.save();
        }
        catch (error) {
            this.handleDatabaseError(error, 'create category');
        }
    }
    async findAll() {
        this.checkDbConnectionStatus();
        try {
            return await this.categoryModel.find().exec();
        }
        catch (error) {
            this.handleDatabaseError(error, 'find all categories');
        }
    }
    async findAllActive() {
        this.checkDbConnectionStatus();
        try {
            return await this.categoryModel.find({ isActive: true }).exec();
        }
        catch (error) {
            this.handleDatabaseError(error, 'find all active categories');
        }
    }
    async findOne(id) {
        this.checkDbConnectionStatus();
        try {
            const category = await this.categoryModel.findById(id).exec();
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${id} not found`);
            }
            return category;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleDatabaseError(error, `find category ${id}`);
        }
    }
    async findByUniqId(uniqId) {
        this.checkDbConnectionStatus();
        try {
            const category = await this.categoryModel.findOne({ uniqId }).exec();
            if (!category) {
                throw new common_1.NotFoundException(`Category with uniqId ${uniqId} not found`);
            }
            return category;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleDatabaseError(error, `find category with uniqId ${uniqId}`);
        }
    }
    async update(id, updateCategoryDto) {
        this.checkDbConnectionStatus();
        try {
            const updatedCategory = await this.categoryModel
                .findByIdAndUpdate(id, updateCategoryDto, { new: true })
                .exec();
            if (!updatedCategory) {
                throw new common_1.NotFoundException(`Category with ID ${id} not found`);
            }
            return updatedCategory;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleDatabaseError(error, `update category ${id}`);
        }
    }
    async remove(id) {
        this.checkDbConnectionStatus();
        try {
            const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();
            if (!deletedCategory) {
                throw new common_1.NotFoundException(`Category with ID ${id} not found`);
            }
            return deletedCategory;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleDatabaseError(error, `delete category ${id}`);
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
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = CategoriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map