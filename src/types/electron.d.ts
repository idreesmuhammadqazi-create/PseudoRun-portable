export interface ElectronAPI {
  // File operations
  readFile: (filePath: string) => Promise<{ success: boolean; data?: string; error?: string }>;
  writeFile: (filePath: string, data: string) => Promise<{ success: boolean; error?: string }>;
  showSaveDialog: (options: SaveDialogOptions) => Promise<SaveDialogResult>;
  showOpenDialog: (options: OpenDialogOptions) => Promise<OpenDialogResult>;

  // App information
  getAppVersion: () => Promise<string>;
  getAppPath: (name: string) => Promise<string>;

  // Menu event listeners
  onMenuAction: (callback: (event: string, data?: any) => void) => void;
  removeAllListeners: (channel: string) => void;
}

export interface SaveDialogOptions {
  defaultPath?: string;
  filters?: Array<{
    name: string;
    extensions: string[];
  }>;
}

export interface SaveDialogResult {
  canceled: boolean;
  filePath?: string;
}

export interface OpenDialogOptions {
  properties?: string[];
  filters?: Array<{
    name: string;
    extensions: string[];
  }>;
}

export interface OpenDialogResult {
  canceled: boolean;
  filePaths?: string[];
}

export interface NodeEnv {
  platform: string;
  arch: string;
  version: string;
}

export interface SafeConsole {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
    nodeEnv?: NodeEnv;
    safeConsole?: SafeConsole;
  }
}

export {};