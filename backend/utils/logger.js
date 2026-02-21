const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/error.log');

const formatError = (error) => {
  if (!error) {
    return 'Unknown error';
  }

  if (error instanceof Error) {
    return error.stack || error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch (_) {
    return String(error);
  }
};

const writeLog = (value) => {
  fs.appendFile(logFilePath, `${new Date().toISOString()} - ${formatError(value)}\n`, (err) => {
    if (err) {
      console.error('Error al escribir en el archivo de registro:', err);
    }
  });
};

const logger = (error) => {
  writeLog(error);
};

logger.error = (error) => {
  writeLog(error);
};

module.exports = logger;
