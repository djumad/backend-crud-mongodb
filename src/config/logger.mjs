import { createLogger, transports, format } from 'winston';
import path from 'path';

const logger = createLogger({
  level: 'info', // level log default
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // tampilkan di console
    new transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.join('logs', 'combined.log'),
    }),
  ],
});

export default logger;
