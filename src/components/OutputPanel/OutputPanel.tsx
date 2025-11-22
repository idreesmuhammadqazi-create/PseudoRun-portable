import React from 'react';

interface OutputPanelProps {
  output: string[];
  errors: string[];
  onClear: () => void;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ output, errors, onClear }) => {
  const hasContent = output.length > 0 || errors.length > 0;

  return (
    <div className="panel">
      <div className="panel-header">
        <span>Output</span>
        {hasContent && (
          <button className="btn btn-icon" onClick={onClear} title="Clear Output">
            🗑️
          </button>
        )}
      </div>
      <div className="panel-content output-content">
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <div key={index} className="error-message">
                ❌ {error}
              </div>
            ))}
          </div>
        )}
        {output.length > 0 && (
          <div className="output-messages">
            {output.map((line, index) => (
              <div key={index} className="output-line">
                {line}
              </div>
            ))}
          </div>
        )}
        {!hasContent && (
          <div className="output-placeholder text-muted">
            Output will appear here when you run your program...
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;