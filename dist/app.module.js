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
var AppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const categories_module_1 = require("./categories/categories.module");
const items_module_1 = require("./items/items.module");
const configuration_1 = require("./config/configuration");
let AppModule = AppModule_1 = class AppModule {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(AppModule_1.name);
    }
    async onApplicationBootstrap() {
        this.logger.log('Application started successfully!');
        this.logger.log(`Server running on port: ${this.configService.get('port')}`);
        const uri = this.configService.get('database.uri');
        if (!uri) {
            this.logger.warn('No MongoDB URI provided. Database functionality will be disabled.');
        }
        else {
            this.logger.log('MongoDB URI configured (masked for security)');
            this.logger.warn('⚠️ MongoDB connectivity issues detected. The application will run with limited functionality.');
            this.logger.warn('⚠️ NOTE: If connection fails, make sure the Replit IP is whitelisted in MongoDB Atlas.');
            this.logger.warn('⚠️ You need to add 0.0.0.0/0 to your MongoDB Atlas IP whitelist to allow connections from anywhere.');
            this.logger.warn('⚠️ Instructions: https://www.mongodb.com/docs/atlas/security-whitelist/');
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = AppModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const uri = configService.get('database.uri');
                    console.log('MongoDB URI configured (masked):', uri ? '******' : 'Missing URI');
                    console.log('⚠️ NOTE: Make sure the Replit IP is whitelisted in MongoDB Atlas.');
                    console.log('⚠️ Add 0.0.0.0/0 to your MongoDB Atlas IP whitelist.');
                    console.log('⚠️ Instructions: https://www.mongodb.com/docs/atlas/security-whitelist/');
                    return {
                        uri,
                        connectTimeoutMS: 5000,
                        socketTimeoutMS: 5000,
                        serverSelectionTimeoutMS: 5000,
                        retryAttempts: 1,
                        retryDelay: 1000,
                        autoIndex: false,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            categories_module_1.CategoriesModule,
            items_module_1.ItemsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppModule);
//# sourceMappingURL=app.module.js.map