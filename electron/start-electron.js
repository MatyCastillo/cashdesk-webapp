const { spawn } = require('child_process');

const electronBinary = require('electron');

const env = {
  ...process.env,
  ELECTRON_START_URL: process.env.ELECTRON_START_URL || 'http://localhost:3000',
};

// If this variable is present, Electron starts in Node mode and app/window APIs are unavailable.
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(electronBinary, ['.'], {
  stdio: 'inherit',
  env,
});

child.on('error', (error) => {
  console.error('No se pudo iniciar Electron:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
