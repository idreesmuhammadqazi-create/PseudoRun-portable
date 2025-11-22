const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),

  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: (name) => ipcRenderer.invoke('get-app-path', name),

  // Menu event listeners
  onMenuAction: (callback) => {
    const menuEvents = [
      'menu-new',
      'menu-open',
      'menu-save',
      'menu-save-as',
      'menu-export-pdf',
      'menu-export-word',
      'menu-toggle-line-numbers',
      'menu-toggle-word-wrap',
      'menu-zoom-in',
      'menu-zoom-out',
      'menu-zoom-reset',
      'menu-run',
      'menu-debug',
      'menu-step-into',
      'menu-continue',
      'menu-stop',
      'menu-clear-output',
      'menu-syntax-reference'
    ];

    menuEvents.forEach(event => {
      ipcRenderer.on(event, (event, data) => callback(event, data));
    });
  },

  // Remove all listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Expose Node.js environment information
contextBridge.exposeInMainWorld('nodeEnv', {
  platform: process.platform,
  arch: process.arch,
  version: process.version
});

// Expose a safe console for debugging
contextBridge.exposeInMainWorld('safeConsole', {
  log: (...args) => console.log('[Renderer]', ...args),
  error: (...args) => console.error('[Renderer]', ...args),
  warn: (...args) => console.warn('[Renderer]', ...args),
  info: (...args) => console.info('[Renderer]', ...args)
});