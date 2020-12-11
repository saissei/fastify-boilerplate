import winston, { Logger } from 'winston';
import 'winston-daily-rotate-file';
import appRoot from 'app-root-path';
type LogMessageNormal = {
  level: 'info' | 'debug';
  message: string;
}

type LogMessageAnomaly = {
  level: 'error' | 'warn';
  message: unknown;
}

export default class LocalLogger {
  private appName = process.env.npm_package_name;
  private logger: Logger;

  /** Specify the name of the application when logging */
  public constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: this.appName },
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.DailyRotateFile ({
          filename: `${this.appName}-%DATE%.log`,
          datePattern: 'YYYYMMDDHH',
          dirname: `${appRoot}/logs/`,
          zippedArchive: true,
          maxFiles: '6m',
          handleExceptions: true,
        })
      ]
    });
    this.logger.exceptions.unhandle();
    this.logger.setMaxListeners(0);
  }

  public debug(message: string): void {
    const logMessage: LogMessageNormal = {
      level: 'debug',
      message
    };
    this.logger.log(logMessage);
  }

  public info(message: string): void {
    const logMessage: LogMessageNormal = {
      level: 'info',
      message
    };
    this.logger.log(logMessage);
  }

  public warn(message: unknown): void {
    const logMessage: LogMessageAnomaly = {
      level: 'warn',
      message
    };
    this.logger.warn(logMessage);
  }

  public error(message: unknown): void {
    const logMessage: LogMessageAnomaly = {
      level: 'error',
      message
    };
    this.logger.error(logMessage);
  }

}
