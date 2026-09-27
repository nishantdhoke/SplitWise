const { testConnection } = require('../config/db');

/**
 * Health Controller
 * 
 * Provides an operational health check endpoint for testing:
 * - Server uptime and status
 * - Live MySQL connection verification
 * - System environment information
 */
const getHealthStatus = async (req, res, next) => {
  try {
    const dbStatus = await testConnection();

    res.status(200).json({
      success: true,
      service: 'Fair Split API',
      status: 'operational',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHealthStatus,
};
