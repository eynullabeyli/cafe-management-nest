"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    console.log('Reading configuration...');
    console.log('PORT:', process.env.PORT || 'not set (using default)');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'is set (value masked)' : 'not set (using default)');
    return {
        port: parseInt(process.env.PORT, 10) || 5005,
        database: {
            uri: process.env.MONGODB_URI || 'mongodb://localhost/nest',
            ssl: true,
            sslValidate: false,
            tlsInsecure: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFallbackData: true,
        },
        env: process.env.NODE_ENV || 'development',
        debug: process.env.DEBUG || false,
    };
};
//# sourceMappingURL=configuration.js.map