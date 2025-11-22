import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { fileManager } from './utils/fileManager';
import { tokenize } from './interpreter/lexer';
import { parse } from './interpreter/parser';
import { Interpreter, RuntimeError } from './interpreter/interpreter';
import './styles/global.css';

// Component imports (we'll create these next)
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import OutputPanel from './components/OutputPanel';
import DebugControls from './components/DebugControls';
import VariablesPanel from './components/VariablesPanel';
import ErrorDisplay from './components/ErrorDisplay';

interface AppContentProps {}

const AppContent: React.FC<AppContentProps> = () => {
  const { theme } = useTheme();

  // State management
  const [code, setCode] = useState<string>('DECLARE x : INTEGER\nx ← 10\nOUTPUT "Hello, World!"\nOUTPUT x');
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [debugState, setDebugState] = useState<any>(null);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);

  // Interpreter instance
  const [interpreter, setInterpreter] = useState<Interpreter | null>(null);

  // Initialize interpreter
  useEffect(() => {
    const inputHandler = async (variableName: string, variableType: string): Promise<string> => {
      // For desktop, we'll implement a proper input dialog later
      // For now, use a simple prompt
      return new Promise((resolve) => {
        const value = window.prompt(`Enter value for ${variableName} (${variableType}):`);
        resolve(value || '');
      });
    };

    const newInterpreter = new Interpreter(
      inputHandler,
      isDebugMode,
      async () => {
        // Debug step callback
        if (interpreter) {
          setDebugState(interpreter.getDebugState());
        }
      },
      true,
      async (filename: string) => {
        // File upload handler for READ operations
        try {
          return await fileManager.readFile(filename);
        } catch {
          throw new Error(`Could not read file: ${filename}`);
        }
      }
    );

    setInterpreter(newInterpreter);
  }, [isDebugMode]);

  // File operations
  const handleNewFile = useCallback(() => {
    if (hasUnsavedChanges) {
      const shouldSave = window.confirm('You have unsaved changes. Do you want to save first?');
      if (shouldSave && currentFile) {
        handleSaveFile();
      }
    }
    setCode('// New pseudocode program\n');
    setCurrentFile(null);
    setHasUnsavedChanges(false);
    setOutput([]);
    setErrors([]);
  }, [hasUnsavedChanges, currentFile]);

  const handleOpenFile = useCallback(async () => {
    try {
      const filePath = await fileManager.showOpenDialog();
      if (filePath) {
        const program = await fileManager.loadProgram(filePath);
        setCode(program.code);
        setCurrentFile(filePath);
        setHasUnsavedChanges(false);
        setOutput([]);
        setErrors([]);
      }
    } catch (error) {
      setErrors([`Failed to open file: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    }
  }, []);

  const handleSaveFile = useCallback(async () => {
    if (!currentFile) {
      handleSaveAsFile();
      return;
    }

    try {
      await fileManager.saveProgram(currentFile, code);
      setHasUnsavedChanges(false);
    } catch (error) {
      setErrors([`Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    }
  }, [currentFile, code]);

  const handleSaveAsFile = useCallback(async () => {
    try {
      const filePath = await fileManager.showSaveDialog();
      if (filePath) {
        await fileManager.saveProgram(filePath, code);
        setCurrentFile(filePath);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      setErrors([`Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    }
  }, [code]);

  const handleExportPDF = useCallback(async () => {
    try {
      await fileManager.exportToPDF(code, currentFile ? fileManager.extractFileName(currentFile) : 'Pseudocode Program');
    } catch (error) {
      setErrors([`Failed to export: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    }
  }, [code, currentFile]);

  // Execution
  const handleRun = useCallback(async () => {
    if (!interpreter) return;

    setIsRunning(true);
    setOutput([]);
    setErrors([]);

    try {
      // Lexical analysis
      const tokens = tokenize(code);

      // Parsing
      const ast = parse(tokens);

      // Execution
      const outputs: string[] = [];
      for await (const output of interpreter.executeProgram(ast)) {
        outputs.push(output);
      }

      setOutput(outputs);
    } catch (error) {
      if (error instanceof RuntimeError) {
        setErrors([`Runtime Error at line ${error.line}: ${error.message}`]);
      } else {
        setErrors([`Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
      }
    } finally {
      setIsRunning(false);
    }
  }, [interpreter, code]);

  const handleDebug = useCallback(() => {
    setIsDebugMode(!isDebugMode);
    if (!isDebugMode) {
      setOutput([]);
      setErrors([]);
    }
  }, [isDebugMode]);

  const handleStop = useCallback(() => {
    if (interpreter) {
      interpreter.disableDebugMode();
    }
    setIsRunning(false);
    setIsDebugMode(false);
  }, [interpreter]);

  const handleClearOutput = useCallback(() => {
    setOutput([]);
    setErrors([]);
  }, []);

  // Code changes
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setHasUnsavedChanges(true);
  }, []);

  // Toggle settings
  const toggleLineNumbers = useCallback(() => {
    setLineNumbers(!lineNumbers);
  }, [lineNumbers]);

  const toggleWordWrap = useCallback(() => {
    setWordWrap(!wordWrap);
  }, [wordWrap]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'o':
            event.preventDefault();
            handleOpenFile();
            break;
          case 's':
            event.preventDefault();
            if (event.shiftKey) {
              handleSaveAsFile();
            } else {
              handleSaveFile();
            }
            break;
          case 'n':
            event.preventDefault();
            handleNewFile();
            break;
        }
      } else if (event.key === 'F5') {
        event.preventDefault();
        handleRun();
      } else if (event.key === 'F6') {
        event.preventDefault();
        handleDebug();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewFile, handleOpenFile, handleSaveFile, handleSaveAsFile, handleRun, handleDebug]);

  // Window title
  useEffect(() => {
    const title = currentFile
      ? `${fileManager.extractFileName(currentFile)} - PseudoRun`
      : hasUnsavedChanges
        ? '*Untitled - PseudoRun'
        : 'Untitled - PseudoRun';

    document.title = title;
  }, [currentFile, hasUnsavedChanges]);

  return (
    <div className={`app ${theme}`}>
      <div className="app-header">
        <Toolbar
          onNewFile={handleNewFile}
          onOpenFile={handleOpenFile}
          onSaveFile={handleSaveFile}
          onSaveAsFile={handleSaveAsFile}
          onExportPDF={handleExportPDF}
          onRun={handleRun}
          onDebug={handleDebug}
          onStop={handleStop}
          onClearOutput={handleClearOutput}
          isRunning={isRunning}
          isDebugMode={isDebugMode}
          hasUnsavedChanges={hasUnsavedChanges}
          currentFile={currentFile}
          toggleLineNumbers={toggleLineNumbers}
          toggleWordWrap={toggleWordWrap}
          lineNumbers={lineNumbers}
          wordWrap={wordWrap}
        />
      </div>

      <div className="app-content">
        <div className="editor-panel">
          <Editor
            code={code}
            onChange={handleCodeChange}
            lineNumbers={lineNumbers}
            wordWrap={wordWrap}
            readOnly={isRunning}
          />
        </div>

        <div className="side-panel">
          {isDebugMode && (
            <div className="debug-panel">
              <DebugControls
                debugState={debugState}
                isRunning={isRunning}
              />
              <VariablesPanel
                variables={debugState?.variables || new Map()}
              />
            </div>
          )}

          <div className="output-panel">
            <OutputPanel
              output={output}
              errors={errors}
              onClear={handleClearOutput}
            />
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <ErrorDisplay
          errors={errors}
          onDismiss={() => setErrors([])}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;