const winston = require('winston');

const infoLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: 'info.log',
            level: 'info'
        }),
        new winston.transports.Console()
    ]
});

const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: 'error.log',
            level: 'error'
        })
    ]
});

module.exports = {
    infoLogger,
    errorLogger
}