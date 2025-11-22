export interface ProgramMetadata {
  name: string;
  author?: string;
  created: string;
  modified: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface ProgramFile {
  metadata: ProgramMetadata;
  code: string;
}

export class FileManager {
  private static instance: FileManager;
  private recentFiles: string[] = [];
  private maxRecentFiles = 10;

  private constructor() {
    this.loadRecentFiles();
  }

  static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }

  async readFile(filePath: string): Promise<string> {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.readFile(filePath);
        if (result.success) {
          this.addToRecentFiles(filePath);
          return result.data;
        } else {
          throw new Error(result.error);
        }
      } else {
        throw new Error('File operations not available in this environment');
      }
    } catch (error) {
      throw new Error(`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.writeFile(filePath, content);
        if (result.success) {
          this.addToRecentFiles(filePath);
        } else {
          throw new Error(result.error);
        }
      } else {
        throw new Error('File operations not available in this environment');
      }
    } catch (error) {
      throw new Error(`Failed to write file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async saveProgram(filePath: string, code: string, metadata?: Partial<ProgramMetadata>): Promise<void> {
    const programData: ProgramFile = {
      metadata: {
        name: this.getFileName(filePath),
        author: metadata?.author || 'User',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        tags: metadata?.tags || [],
        difficulty: metadata?.difficulty || 'beginner',
        ...metadata
      },
      code
    };

    let content: string;
    if (filePath.endsWith('.pseudo')) {
      content = JSON.stringify(programData, null, 2);
    } else {
      content = code; // Plain text format
    }

    await this.writeFile(filePath, content);
  }

  private getFileName(filePath: string): string {
    return filePath.split(/[\\/]/).pop() || 'untitled';
  }

  async loadProgram(filePath: string): Promise<{ code: string; metadata?: ProgramMetadata }> {
    const content = await this.readFile(filePath);

    if (filePath.endsWith('.pseudo')) {
      try {
        const programData: ProgramFile = JSON.parse(content);
        return {
          code: programData.code,
          metadata: programData.metadata
        };
      } catch {
        // If JSON parsing fails, treat as plain text
        return { code: content };
      }
    } else {
      return { code: content };
    }
  }

  async showOpenDialog(): Promise<string | null> {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.showOpenDialog({
          properties: ['openFile'],
          filters: [
            { name: 'PseudoCode Files', extensions: ['pseudo', 'txt'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        });

        if (!result.canceled && result.filePaths && result.filePaths.length > 0) {
          return result.filePaths[0];
        }
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to show open dialog: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async showSaveDialog(defaultPath?: string): Promise<string | null> {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.showSaveDialog({
          defaultPath,
          filters: [
            { name: 'PseudoCode Files', extensions: ['pseudo'] },
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        });

        if (!result.canceled && result.filePath) {
          return result.filePath;
        }
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to show save dialog: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getRecentFiles(): string[] {
    return [...this.recentFiles];
  }

  extractFileName(filePath: string): string {
    return filePath.split(/[\\/]/).pop() || 'untitled';
  }

  private addToRecentFiles(filePath: string): void {
    const index = this.recentFiles.indexOf(filePath);
    if (index > -1) {
      this.recentFiles.splice(index, 1);
    }

    this.recentFiles.unshift(filePath);

    if (this.recentFiles.length > this.maxRecentFiles) {
      this.recentFiles = this.recentFiles.slice(0, this.maxRecentFiles);
    }

    this.saveRecentFiles();
  }

  private loadRecentFiles(): void {
    try {
      const saved = localStorage.getItem('pseudorun-recent-files');
      if (saved) {
        this.recentFiles = JSON.parse(saved);
      }
    } catch {
      this.recentFiles = [];
    }
  }

  private saveRecentFiles(): void {
    try {
      localStorage.setItem('pseudorun-recent-files', JSON.stringify(this.recentFiles));
    } catch {
      // Ignore errors
    }
  }

  private extractFileName(filePath: string): string {
    return filePath.split(/[\\/]/).pop() || 'untitled';
  }

  async exportToPDF(code: string, title?: string): Promise<void> {
    // PDF export would require additional dependencies
    // For now, we'll create a simple text representation
    try {
      const filePath = await this.showSaveDialog();
      if (filePath) {
        const content = this.createPDFContent(code, title);
        await this.writeFile(filePath, content);
      }
    } catch (error) {
      throw new Error(`Failed to export to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private createPDFContent(code: string, title?: string): string {
    const timestamp = new Date().toLocaleString();
    let content = '';

    if (title) {
      content += `${title}\n${'='.repeat(title.length)}\n\n`;
    }

    content += `Generated by PseudoRun Desktop\n${timestamp}\n\n`;
    content += `${'-'.repeat(50)}\n\n`;
    content += code;

    return content;
  }
}

// Global instance
export const fileManager = FileManager.getInstance();