import React, { useEffect, useRef } from 'react';

interface EditorProps {
  code: string;
  onChange: (value: string) => void;
  lineNumbers: boolean;
  wordWrap: boolean;
  readOnly?: boolean;
}

const Editor: React.FC<EditorProps> = ({
  code,
  onChange,
  lineNumbers,
  wordWrap,
  readOnly = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [code]);

  return (
    <div className="editor-container">
      <div className="editor-wrapper">
        {lineNumbers && (
          <div className="line-numbers">
            {code.split('\n').map((_, index) => (
              <div key={index} className="line-number">
                {index + 1}
              </div>
            ))}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          className="editor-textarea"
          style={{
            fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            resize: 'none',
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
            overflow: wordWrap ? 'hidden' : 'auto',
            flex: 1,
            border: 'none',
            outline: 'none',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            padding: '12px'
          }}
          placeholder="// Enter your pseudocode here..."
          disabled={readOnly}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default Editor;