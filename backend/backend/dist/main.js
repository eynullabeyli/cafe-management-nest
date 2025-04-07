"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    logger.log('Starting bootstrap process...');
    let appStarted = false;
    const timeout = setTimeout(() => {
        if (!appStarted) {
            logger.error('Application startup timed out after 15 seconds');
            logger.error('This may be due to MongoDB connection issues - but we will continue without database connectivity');
            startMinimalAppWithoutDatabase().catch(err => {
                logger.error(`Failed to start minimal app: ${err.message}`);
                process.exit(1);
            });
        }
    }, 15000);
    try {
        logger.log('Creating Nest application...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['error', 'warn', 'debug', 'log', 'verbose'],
            abortOnError: false
        });
        logger.log('Nest application created successfully');
        clearTimeout(timeout);
        appStarted = true;
        app.enableCors({
            origin: [
                'http://localhost:3000',
                'http://172.31.128.44:3000',
                /\.replit\.dev$/,
                /\.replit\.app$/,
                'https://f983daf1-bd62-47b0-b629-26314f3bcb7a-00-s70cy84odon4.picard.replit.dev',
                'https://f983daf1-bd62-47b0-b629-26314f3bcb7a.id.replit.dev',
                '*'
            ],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
            allowedHeaders: 'Authorization,Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range',
            preflightContinue: false,
            optionsSuccessStatus: 204
        });
        logger.log('Setting global prefix...');
        app.setGlobalPrefix('api');
        logger.log('Applying global pipes, filters and interceptors...');
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: false,
            skipMissingProperties: true,
        }));
        app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
        app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
        logger.log('Setting up Swagger documentation...');
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Cafe Management API')
            .setDescription('API documentation for Cafe Management System')
            .setVersion('1.0')
            .addTag('categories', 'Category management endpoints')
            .addTag('items', 'Item management endpoints')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
        logger.log('Starting server...');
        const port = process.env.PORT || 5005;
        await app.listen(port, '0.0.0.0');
        logger.log(`Application is running on: ${await app.getUrl()}`);
    }
    catch (error) {
        logger.error(`Bootstrap failed with error: ${error.message}`);
        logger.error('Attempting to start minimal application without database connectivity...');
        startMinimalAppWithoutDatabase().catch(err => {
            logger.error(`Failed to start minimal app: ${err.message}`);
            process.exit(1);
        });
    }
}
async function startMinimalAppWithoutDatabase() {
    const logger = new common_1.Logger('FallbackApp');
    logger.warn('Starting minimal application without database connectivity');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log'],
        abortOnError: false,
        bufferLogs: true,
    });
    app.useLogger(app.get(common_1.Logger));
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://172.31.128.44:3000',
            /\.replit\.dev$/,
            /\.replit\.app$/,
            'https://f983daf1-bd62-47b0-b629-26314f3bcb7a-00-s70cy84odon4.picard.replit.dev',
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
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        skipMissingProperties: true,
        transform: true,
    }));
    logger.log('Setting up Swagger documentation for minimal app...');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Cafe Management API')
        .setDescription('API documentation for Cafe Management System (Limited Functionality)')
        .setVersion('1.0')
        .addTag('categories', 'Category management endpoints')
        .addTag('items', 'Item management endpoints')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 5005;
    await app.listen(port, '0.0.0.0');
    logger.log(`Minimal application is running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map