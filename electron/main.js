const path = require('path');
const fs = require('fs');
const os = require('os');
const { app, BrowserWindow, dialog, shell } = require('electron');

const isDev = !app.isPackaged;
const frontendDevUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
const backendPort = Number(process.env.BACKEND_PORT || process.env.PORT || 8080);

let mainWindow = null;
let isQuitting = false;
const startupLogPath = path.join(os.tmpdir(), 'cashdesk-startup.log');

const logStartup = (message, error) => {
  const details = error
    ? `\n${error.stack || error.message || String(error)}`
    : '';

  try {
    fs.appendFileSync(
      startupLogPath,
      `[${new Date().toISOString()}] ${message}${details}\n`,
      'utf8'
    );
  } catch (_) {
    // no-op
  }
};

logStartup('Electron main loaded');

const configureBackendEnv = () => {
  const dbDirectory = path.join(app.getPath('userData'), 'data');
  fs.mkdirSync(dbDirectory, { recursive: true });

  if (!process.env.SQLITE_DB_PATH) {
    process.env.SQLITE_DB_PATH = path.join(dbDirectory, 'toribio.sqlite');
  }

  process.env.PORT = String(backendPort);
};

const startBackend = async () => {
  logStartup('Starting backend');
  configureBackendEnv();
  const { startServer } = require(path.join(__dirname, '..', 'backend', 'server'));
  try {
    await startServer({ port: backendPort });
    logStartup(`Backend started on port ${backendPort}`);
  } catch (error) {
    if (error && error.code === 'EADDRINUSE') {
      logStartup(`Port ${backendPort} already in use. App will continue.`, error);
      return;
    }
    throw error;
  }
};

const stopBackend = async () => {
  const { stopServer } = require(path.join(__dirname, '..', 'backend', 'server'));
  await stopServer();
};

const createWindow = async () => {
  logStartup('Creating BrowserWindow');
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    logStartup('Window ready-to-show');
    mainWindow.show();
  });

  mainWindow.webContents.on('did-fail-load', (_, code, description, validatedURL) => {
    logStartup(
      `did-fail-load code=${code} description=${description} url=${validatedURL}`
    );
  });

  mainWindow.webContents.on('render-process-gone', (_, details) => {
    logStartup(`Renderer gone reason=${details.reason} exitCode=${details.exitCode}`);
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    await mainWindow.loadURL(frontendDevUrl);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    return;
  }

  await mainWindow.loadFile(path.join(__dirname, '..', 'build', 'index.html'));
};

process.on('uncaughtException', (error) => {
  logStartup('uncaughtException', error);
});

process.on('unhandledRejection', (reason) => {
  logStartup('unhandledRejection', reason instanceof Error ? reason : new Error(String(reason)));
});

app.whenReady().then(async () => {
  logStartup('App ready');
  try {
    await startBackend();
    await createWindow();
  } catch (error) {
    logStartup('No se pudo iniciar la app de escritorio', error);
    dialog.showErrorBox(
      'Cashdesk - Error de inicio',
      `No se pudo iniciar la aplicacion.\n\n${error.message}\n\nLog: ${startupLogPath}`
    );
    app.quit();
    return;
  }

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', (event) => {
  if (isQuitting) {
    return;
  }

  event.preventDefault();
  isQuitting = true;

  stopBackend()
    .catch((error) => {
      logStartup('No se pudo detener el backend', error);
    })
    .finally(() => {
      app.quit();
    });
});
