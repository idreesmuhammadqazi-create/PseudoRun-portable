import React from 'react';

interface ToolbarProps {
  onNewFile: () => void;
  onOpenFile: () => void;
  onSaveFile: () => void;
  onSaveAsFile: () => void;
  onExportPDF: () => void;
  onRun: () => void;
  onDebug: () => void;
  onClearOutput: () => void;
  isRunning: boolean;
  isDebugMode: boolean;
  hasUnsavedChanges: boolean;
  currentFile: string | null;
  toggleLineNumbers: () => void;
  toggleWordWrap: () => void;
  lineNumbers: boolean;
  wordWrap: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onNewFile,
  onOpenFile,
  onSaveFile,
  onSaveAsFile,
  onExportPDF,
  onRun,
  onDebug,
  onStop,
  onClearOutput,
  isRunning,
  isDebugMode,
  hasUnsavedChanges,
  currentFile,
  toggleLineNumbers,
  toggleWordWrap,
  lineNumbers,
  wordWrap
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <div className="btn-group">
          <button className="btn btn-icon" onClick={onNewFile} title="New (Ctrl+N)">
            📄
          </button>
          <button className="btn btn-icon" onClick={onOpenFile} title="Open (Ctrl+O)">
            📁
          </button>
          <button
            className={`btn btn-icon ${hasUnsavedChanges ? 'btn-warning' : ''}`}
            onClick={onSaveFile}
            title="Save (Ctrl+S)"
          >
            💾
          </button>
          <button className="btn btn-icon" onClick={onSaveAsFile} title="Save As (Ctrl+Shift+S)">
            💾➕
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        <div className="btn-group">
          <button
            className={`btn ${isRunning ? 'btn-error' : 'btn-success'}`}
            onClick={onRun}
            disabled={isRunning}
            title="Run (F5)"
          >
            {isRunning ? '⏹️ Stop' : '▶️ Run'}
          </button>
          <button
            className={`btn ${isDebugMode ? 'btn-warning' : 'btn-primary'}`}
            onClick={onDebug}
            title="Debug (F6)"
          >
            🐛 {isDebugMode ? 'Debug On' : 'Debug Off'}
          </button>
          <button className="btn" onClick={onClearOutput} title="Clear Output">
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        <div className="btn-group">
          <button className="btn" onClick={onExportPDF} title="Export to PDF">
            📄 Export
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        <div className="btn-group">
          <button
            className={`btn ${lineNumbers ? 'btn-primary' : ''}`}
            onClick={toggleLineNumbers}
            title="Toggle Line Numbers"
          >
            #️⃣
          </button>
          <button
            className={`btn ${wordWrap ? 'btn-primary' : ''}`}
            onClick={toggleWordWrap}
            title="Toggle Word Wrap"
          >
            📝
          </button>
        </div>
      </div>

      <div className="toolbar-section flex-1">
        <div className="file-info">
          {currentFile ? (
            <span className="text-secondary">
              {currentFile.split(/[\\/]/).pop()}
              {hasUnsavedChanges && ' *'}
            </span>
          ) : (
            <span className="text-muted">
              Untitled{hasUnsavedChanges && ' *'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;