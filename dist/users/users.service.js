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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = UsersService_1 = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
        this.logger = new common_1.Logger(UsersService_1.name);
        this.isDbConnected = false;
        if (!this.userModel) {
            this.isDbConnected = false;
            this.logger.warn('MongoDB model is not available. Database operations will not work.');
            this.logger.warn('The application will run with limited functionality.');
        }
        else {
            this.checkDbConnection();
        }
    }
    async checkDbConnection() {
        if (!this.userModel || !this.userModel.db) {
            this.isDbConnected = false;
            this.logger.error('Database model is not properly initialized');
            return;
        }
        try {
            await this.userModel.db.db.command({ ping: 1 });
            this.isDbConnected = true;
            this.logger.log('MongoDB connection is available');
        }
        catch (error) {
            this.isDbConnected = false;
            this.logger.error(`MongoDB connection failed: ${error.message}`);
            this.logger.warn('API will run with limited functionality - database operations will not be available');
            if (error.message.includes('SSL') || error.message.includes('TLS')) {
                this.logger.error('SSL/TLS connection error detected. This might be due to TLS certificate validation issues.');
                this.logger.warn('Ensure MongoDB Atlas configuration allows modern TLS connections.');
            }
            else if (error.message.includes('whitelist') || error.message.includes('IP address')) {
                this.logger.error('IP whitelist error detected. Replit IP is not whitelisted in MongoDB Atlas.');
                this.logger.warn('Add 0.0.0.0/0 to your MongoDB Atlas IP whitelist to allow connections from anywhere.');
            }
            else if (error.message.includes('authentication') || error.message.includes('auth')) {
                this.logger.error('Authentication error detected. Credentials in the connection string may be incorrect.');
            }
            else if (error.message.includes('timeout')) {
                this.logger.error('Connection timeout. Network issues or firewall restrictions may be preventing connection.');
            }
        }
    }
    async create(createUserDto) {
        this.checkDbConnectionStatus();
        try {
            const createdUser = new this.userModel(createUserDto);
            return await createdUser.save();
        }
        catch (error) {
            this.handleDatabaseError(error, 'create user');
        }
    }
    async findAll(options = {}) {
        this.checkDbConnectionStatus();
        try {
            const { limit = 10, skip = 0 } = options;
            return await this.userModel.find().limit(limit).skip(skip).exec();
        }
        catch (error) {
            this.handleDatabaseError(error, 'find all users');
        }
    }
    async findOne(id) {
        this.checkDbConnectionStatus();
        try {
            const user = await this.userModel.findById(id).exec();
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            return user;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleDatabaseError(error, `find user ${id}`);
        }
    }
    async update(id, updateUserDto) {
        this.checkDbConnectionStatus();
        try {
            const updatedUser = await this.userModel
                .findByIdAndUpdate(id, updateUserDto, { new: true })
                .exec();
            if (!updatedUser) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            return updatedUser;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleDatabaseError(error, `update user ${id}`);
        }
    }
    async remove(id) {
        this.checkDbConnectionStatus();
        try {
            const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
            if (!deletedUser) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            return deletedUser;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleDatabaseError(error, `delete user ${id}`);
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
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map