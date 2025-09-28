import 'dotenv/config';
import Server from './app';
import { config } from './config/environment';
import { DatabaseService } from './services/database';

async function bootstrap() {
  try {
    // Validate environment configuration
    console.log('🔧 Validating configuration...');
    if (!config.validate()) {
      console.error('❌ Configuration validation failed');
      process.exit(1);
    }

    // Initialize database connection
    console.log('🗄️  Initializing database connection...');
    const dbService = DatabaseService.getInstance();
    await dbService.connect();
    console.log('✅ Database connected successfully');

    // Start server
    console.log('🚀 Starting server...');
    const server = new Server();
    server.start();

    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n📤 Received ${signal}, shutting down gracefully...`);
      
      try {
        await dbService.disconnect();
        console.log('✅ Database disconnected');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap();
