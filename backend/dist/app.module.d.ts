import { OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class AppModule implements OnApplicationBootstrap {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    onApplicationBootstrap(): Promise<void>;
}
