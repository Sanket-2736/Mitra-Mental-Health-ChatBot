require('dotenv').config();
const { server } = require('./src/app');   // import server, not just app
const connectDB = require('./src/utils/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

// Connect DB
connectDB().then(() => {
  console.log('Database connected successfully');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
