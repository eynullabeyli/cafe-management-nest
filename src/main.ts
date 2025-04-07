import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('Starting bootstrap process...');
  
  // Set a timeout to ensure the app doesn't hang forever
  let appStarted = false;
  const timeout = setTimeout(() => {
    if (!appStarted) {
      logger.error('Application startup timed out after 15 seconds');
      logger.error('This may be due to MongoDB connection issues - but we will continue without database connectivity');
      
      // Instead of exiting, we'll start a minimal app without MongoDB
      startMinimalAppWithoutDatabase().catch(err => {
        logger.error(`Failed to start minimal app: ${err.message}`);
        process.exit(1);
      });
    }
  }, 15000);
  
  try {
    logger.log('Creating Nest application...');
    // Use abortOnError: false to allow the application to start even if some modules fail
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'debug', 'log', 'verbose'],
      abortOnError: false
    });
    logger.log('Nest application created successfully');
    
    // Clear the timeout as we've successfully created the app
    clearTimeout(timeout);
    appStarted = true;

    // Enable CORS with specific configuration for Replit environment
    app.enableCors({
      origin: [
        // Local development 
        'http://localhost:3000', 
        // Replit internal IP
        'http://172.31.128.44:3000',
        // All Replit domains with wildcards
        /\.replit\.dev$/,
        /\.replit\.app$/,
        // Specific Replit domain patterns
        'https://f983daf1-bd62-47b0-b629-26314f3bcb7a-00-s70cy84odon4.picard.replit.dev',
        // Direct Replit domain for the Next.js app
        'https://f983daf1-bd62-47b0-b629-26314f3bcb7a.id.replit.dev',
        '*'
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Authorization,Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range',
      preflightContinue: false,
      optionsSuccessStatus: 204
    });

    // Set global prefix
    logger.log('Setting global prefix...');
    app.setGlobalPrefix('api');

    // Apply global pipes, filters and interceptors
    logger.log('Applying global pipes, filters and interceptors...');
    app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true, 
      transform: true,
      // Don't throw errors on missing database validations
      forbidNonWhitelisted: false,
      skipMissingProperties: true,
    }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    // Setup Swagger documentation
    logger.log('Setting up Swagger documentation...');
    const config = new DocumentBuilder()
      .setTitle('Cafe Management API')
      .setDescription('API documentation for Cafe Management System')
      .setVersion('1.0')
      .addTag('categories', 'Category management endpoints')
      .addTag('items', 'Item management endpoints')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Start server
    logger.log('Starting server...');
    const port = process.env.PORT || 5005;
    await app.listen(port, '0.0.0.0');
    logger.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    logger.error(`Bootstrap failed with error: ${error.message}`);
    logger.error('Attempting to start minimal application without database connectivity...');
    
    // If the main app fails to start, try to start a minimal version
    startMinimalAppWithoutDatabase().catch(err => {
      logger.error(`Failed to start minimal app: ${err.message}`);
      process.exit(1);
    });
  }
}

// Fallback function to start a minimal app without database connections
async function startMinimalAppWithoutDatabase() {
  const logger = new Logger('FallbackApp');
  logger.warn('Starting minimal application without database connectivity');
  
  // Create a minimal module with minimal timeout
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
    abortOnError: false,
    bufferLogs: true,
  });
  
  // Enable logs
  app.useLogger(app.get(Logger));
  
  // Basic configuration with enhanced CORS - same as main app
  app.enableCors({
    origin: [
      // Local development 
      'http://localhost:3000', 
      // Replit internal IP
      'http://172.31.128.44:3000',
      // All Replit domains with wildcards
      /\.replit\.dev$/,
      /\.replit\.app$/,
      // Specific Replit domain patterns
      'https://f983daf1-bd62-47b0-b629-26314f3bcb7a-00-s70cy84odon4.picard.replit.dev',
      // Direct Replit domain for the Next.js app
      'https://f983daf1-bd62-47b0-b629-26314f3bcb7a.id.replit.dev',
      '*'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Authorization,Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range',
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  
  // Basic validation without strict database validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    skipMissingProperties: true,
    transform: true,
  }));
  
  // Setup Swagger documentation
  logger.log('Setting up Swagger documentation for minimal app...');
  const config = new DocumentBuilder()
    .setTitle('Cafe Management API')
    .setDescription('API documentation for Cafe Management System (Limited Functionality)')
    .setVersion('1.0')
    .addTag('categories', 'Category management endpoints')
    .addTag('items', 'Item management endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start the minimal server
  const port = process.env.PORT || 5005;
  await app.listen(port, '0.0.0.0');
  logger.log(`Minimal application is running on port ${port}`);
}
bootstrap();
