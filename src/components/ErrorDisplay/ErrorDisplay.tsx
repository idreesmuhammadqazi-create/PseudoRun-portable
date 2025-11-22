import React from 'react';

interface ErrorDisplayProps {
  errors: string[];
  onDismiss: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors, onDismiss }) => {
  if (errors.length === 0) return null;

  return (
    <div className="error-overlay">
      <div className="error-dialog fade-in">
        <div className="error-header">
          <h3>⚠️ Error{errors.length > 1 ? 's' : ''}</h3>
          <button className="btn btn-icon" onClick={onDismiss} title="Dismiss">
            ✕
          </button>
        </div>
        <div className="error-content">
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              {error}
            </div>
          ))}
        </div>
        <div className="error-footer">
          <button className="btn btn-primary" onClick={onDismiss}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;