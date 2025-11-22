import React from 'react';

interface DebugControlsProps {
  debugState: any;
  isRunning: boolean;
}

const DebugControls: React.FC<DebugControlsProps> = ({ debugState, isRunning }) => {
  return (
    <div className="panel">
      <div className="panel-header">
        <span>Debug Controls</span>
      </div>
      <div className="panel-content debug-content">
        <div className="debug-info">
          {debugState ? (
            <>
              <div className="debug-item">
                <strong>Current Line:</strong> {debugState.currentLine || 'N/A'}
              </div>
              <div className="debug-item">
                <strong>Status:</strong>{' '}
                <span className={isRunning ? 'status-running' : 'status-success'}>
                  {isRunning ? 'Running' : 'Paused'}
                </span>
              </div>
              <div className="debug-item">
                <strong>Call Stack:</strong>
                <div className="call-stack">
                  {debugState.callStack?.map((frame: any, index: number) => (
                    <div key={index} className="call-stack-item">
                      {frame.name} (line {frame.line})
                    </div>
                  )) || <div className="text-muted">No call stack</div>}
                </div>
              </div>
            </>
          ) : (
            <div className="text-muted">
              Debug mode is inactive. Click the Debug button to start debugging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugControls;