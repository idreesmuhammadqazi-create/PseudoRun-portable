import React from 'react';

interface VariablesPanelProps {
  variables: Map<string, any>;
}

const VariablesPanel: React.FC<VariablesPanelProps> = ({ variables }) => {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return 'null';
    }
    if (typeof value === 'boolean') {
      return value ? 'TRUE' : 'FALSE';
    }
    if (typeof value === 'object' && value.initialized !== undefined) {
      return value.initialized ? formatValue(value.value) : 'uninitialized';
    }
    return String(value);
  };

  const variableArray = Array.from(variables.entries());

  return (
    <div className="panel">
      <div className="panel-header">
        <span>Variables</span>
      </div>
      <div className="panel-content variables-content">
        {variableArray.length > 0 ? (
          <div className="variables-list">
            {variableArray.map(([name, variable]) => (
              <div key={name} className="variable-item">
                <div className="variable-name">
                  <strong>{name}</strong>
                  <span className="variable-type text-muted">
                    {variable.type || 'unknown'}
                  </span>
                </div>
                <div className="variable-value">
                  {formatValue(variable)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted">
            No variables declared yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default VariablesPanel;