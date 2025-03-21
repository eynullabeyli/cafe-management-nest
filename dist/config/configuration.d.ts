declare const _default: () => {
    port: number;
    database: {
        uri: string;
        ssl: boolean;
        sslValidate: boolean;
        tlsInsecure: boolean;
        useNewUrlParser: boolean;
        useUnifiedTopology: boolean;
    };
    env: string;
    debug: string | boolean;
};
export default _default;
