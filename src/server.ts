import app from './app.js';
import config from './config/env.js';

const startServer = async (): Promise<void> => {
  try {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
