import winston from 'winston'
import appRoot from 'app-root-path'

// 1. silly
// 2. debug
// 3. verbose
// 4. info
// 5. http
// 6. warn
// 7. error

const options = {
  File: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    format: winston.format.json(),
    maxsize: 5000000, // 5MB
    maxFile: 5
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }
}

export const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.File),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false
})

logger.stream = {
  write: function (message) {
    logger.info(message)
  }
}
