const { initializeServer } = require('./src/api/server');
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Initialize server and database
    const { app } = await initializeServer();
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📡 API endpoint available at http://localhost:${PORT}/api/analyze`);
      console.log(`\nPress Ctrl+C to stop the server\n`);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\nShutting down server...');
      server.close(() => {
        console.log('Server has been stopped');
        process.exit(0);
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
startServer();
