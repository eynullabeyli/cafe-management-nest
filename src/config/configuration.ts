export default () => {
  console.log('Reading configuration...');
  console.log('PORT:', process.env.PORT || 'not set (using default)');
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'is set (value masked)' : 'not set (using default)');
  
  return {
    port: parseInt(process.env.PORT, 10) || 5000,
    database: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost/nest',
      // SSL/TLS options to help with connection issues
      ssl: true,
      sslValidate: false, // Try disabling SSL validation to troubleshoot TLS issues
      tlsInsecure: true, // This may help with specific TLS handshake problems
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Set this to true to enable fallback data mode when DB is unavailable
      useFallbackData: true,
    },
    // Environment information
    env: process.env.NODE_ENV || 'development',
    debug: process.env.DEBUG || false,
  };
};
