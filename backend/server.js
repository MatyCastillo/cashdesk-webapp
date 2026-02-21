const app = require('./app');

let serverInstance = null;

const startServer = ({ port } = {}) => {
  const targetPort = Number(port || process.env.PORT || 8080);

  if (serverInstance) {
    return Promise.resolve(serverInstance);
  }

  return new Promise((resolve, reject) => {
    serverInstance = app.listen(targetPort, () => {
      console.log(`Servidor iniciado en http://localhost:${targetPort}`);
      resolve(serverInstance);
    });

    serverInstance.on('error', (error) => {
      serverInstance = null;
      reject(error);
    });
  });
};

const stopServer = () => {
  if (!serverInstance) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    serverInstance.close((error) => {
      if (error && error.code !== 'ERR_SERVER_NOT_RUNNING') {
        reject(error);
        return;
      }
      serverInstance = null;
      resolve();
    });
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error('No se pudo iniciar el servidor:', error);
    process.exit(1);
  });
}

module.exports = {
  startServer,
  stopServer,
};
