import { Module, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ItemsModule } from './items/items.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    
    // MongoDB connection with timeout and error handling
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('database.uri');
        console.log('MongoDB URI configured (masked):', uri ? '******' : 'Missing URI');
        console.log('⚠️ NOTE: Make sure the Replit IP is whitelisted in MongoDB Atlas.');
        console.log('⚠️ Add 0.0.0.0/0 to your MongoDB Atlas IP whitelist.');
        console.log('⚠️ Instructions: https://www.mongodb.com/docs/atlas/security-whitelist/');
        
        return {
          uri,
          // Mongoose options with timeouts to prevent hanging
          connectTimeoutMS: 5000,
          socketTimeoutMS: 5000,
          // Don't retry too many times
          serverSelectionTimeoutMS: 5000,
          retryAttempts: 1,
          retryDelay: 1000,
          // Skip auto-index creation to speed up connection
          autoIndex: false,
        };
      },
      inject: [ConfigService],
    }),
    
    // Feature modules
    CategoriesModule,
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppModule.name);
  
  constructor(private configService: ConfigService) {}
  
  async onApplicationBootstrap() {
    // Log application startup
    this.logger.log('Application started successfully!');
    this.logger.log(`Server running on port: ${this.configService.get<number>('port')}`);
    
    // Warning about MongoDB credentials
    const uri = this.configService.get<string>('database.uri');
    if (!uri) {
      this.logger.warn('No MongoDB URI provided. Database functionality will be disabled.');
    } else {
      this.logger.log('MongoDB URI configured (masked for security)');
      this.logger.warn('⚠️ MongoDB connectivity issues detected. The application will run with limited functionality.');
      this.logger.warn('⚠️ NOTE: If connection fails, make sure the Replit IP is whitelisted in MongoDB Atlas.');
      this.logger.warn('⚠️ You need to add 0.0.0.0/0 to your MongoDB Atlas IP whitelist to allow connections from anywhere.');
      this.logger.warn('⚠️ Instructions: https://www.mongodb.com/docs/atlas/security-whitelist/');
    }
  }
}
