import React, { useState, useEffect } from 'react'
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

function CodeEditor({ language, value, onChange }) {
  const [editorHeight, setEditorHeight] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(value || getStartCode(language));
  }, [language, value]);

  const handleCodeChange = (newValue) => {
    setContent(newValue);
    onChange(newValue);
  };

  const getStartCode = (lang) => {
    const codes = {
      "c_cpp": `#include <stdio.h>\nint main() {\n  // code here\n  return 0;\n}`,
      "python": `def main():\n    # code here\n\nif __name__ == "__main__":\n    main()`
    };
    return codes[lang] || "";
  };

  useEffect(() => {
    function updateEditorHeight() {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const footerHeight = document.querySelector('.footer')?.offsetHeight || 0;
      const availableHeight = window.innerHeight - headerHeight - footerHeight;
      setEditorHeight(`${availableHeight}px`);
    }

    updateEditorHeight();
    window.addEventListener('resize', updateEditorHeight);

    return () => window.removeEventListener('resize', updateEditorHeight);
  }, []);

  return (
    <AceEditor
      mode={language}
      theme="monokai"
      width="100%"
      height={editorHeight}
      style={{ borderRadius: '4px' }}
      onChange={handleCodeChange}
      name="codeEditor"
      fontSize={16}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={content}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );
}

export default CodeEditor;
