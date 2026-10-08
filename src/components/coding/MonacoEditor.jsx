/**
 * Monaco Editor Component for Code Editing
 */
import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { 
  Settings,
  Maximize2,
  Minimize2,
  Save,
  RefreshCw
} from 'lucide-react';
import Button from '../ui/Button';
import useCodingStore from '../../store/codingStore';

const LANGUAGE_MAP = {
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  cpp: 'cpp',
  c: 'c'
};

const LANGUAGE_TEMPLATES = {
  python: `def solution():
    # Write your solution here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`,
  
  javascript: `function solution() {
    // Write your solution here
    return null;
}

// Test your solution
console.log(solution());`,
  
  java: `public class Solution {
    public static void main(String[] args) {
        Solution sol = new Solution();
        // Test your solution
        System.out.println("Result: " + sol.solve());
    }
    
    public int solve() {
        // Write your solution here
        return 0;
    }
}`,
  
  cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int solve() {
        // Write your solution here
        return 0;
    }
};

int main() {
    Solution sol;
    cout << "Result: " << sol.solve() << endl;
    return 0;
}`,
  
  c: `#include <stdio.h>

int solve() {
    // Write your solution here
    return 0;
}

int main() {
    printf("Result: %d\\n", solve());
    return 0;
}`
};

export default function MonacoEditor({
  value = '',
  onChange,
  language = 'python',
  height = '400px',
  readOnly = false,
  showSettings = true,
  showActions = true,
  onRun,
  onSubmit,
  onSave,
  className = ''
}) {
  const editorRef = useRef(null);
  const { editorSettings, updateEditorSettings } = useCodingStore();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = React.useState(false);

  // Initialize with template if empty
  React.useEffect(() => {
    if (!value && LANGUAGE_TEMPLATES[language]) {
      onChange?.(LANGUAGE_TEMPLATES[language]);
    }
  }, [language, value, onChange]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: editorSettings.fontSize,
      theme: editorSettings.theme,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      insertSpaces: true,
      tabSize: language === 'python' ? 4 : 2,
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun?.();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      onSubmit?.();
    });

    // Auto-save functionality
    if (editorSettings.autoSave) {
      let saveTimeout;
      editor.onDidChangeModelContent(() => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          const content = editor.getValue();
          localStorage.setItem(`coding-editor-${language}`, content);
        }, 1000);
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetCode = () => {
    if (confirm('Are you sure you want to reset the code? This action cannot be undone.')) {
      onChange?.(LANGUAGE_TEMPLATES[language] || '');
    }
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const editorComponent = (
    <div className={`relative border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      {(showSettings || showActions) && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {language}
            </span>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
          
          <div className="flex items-center space-x-2">
            {showActions && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={formatCode}
                  title="Format Code (Ctrl+Shift+F)"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetCode}
                  title="Reset Code"
                >
                  Reset
                </Button>
                
                {onSave && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSave}
                    title="Save (Ctrl+S)"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                )}
              </>
            )}
            
            {showSettings && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                  title="Editor Settings"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettingsPanel && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Theme</label>
              <select
                value={editorSettings.theme}
                onChange={(e) => updateEditorSettings({ theme: e.target.value })}
                className="w-full px-2 py-1 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              >
                <option value="vs-light">Light</option>
                <option value="vs-dark">Dark</option>
                <option value="hc-black">High Contrast</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Font Size</label>
              <select
                value={editorSettings.fontSize}
                onChange={(e) => updateEditorSettings({ fontSize: parseInt(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              >
                <option value="12">12px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
                <option value="20">20px</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoSave"
                checked={editorSettings.autoSave}
                onChange={(e) => updateEditorSettings({ autoSave: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="autoSave" className="text-gray-700 dark:text-gray-300">
                Auto Save
              </label>
            </div>
          </div>
        </motion.div>
      )}

      {/* Editor */}
      <Editor
        height={isFullscreen ? 'calc(100vh - 120px)' : height}
        language={LANGUAGE_MAP[language] || language}
        theme={editorSettings.theme}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          fontSize: editorSettings.fontSize,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          insertSpaces: true,
          tabSize: language === 'python' ? 4 : 2,
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showFunctions: true,
          },
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true
          },
          parameterHints: {
            enabled: true
          },
          hover: {
            enabled: true
          }
        }}
      />

      {/* Action Buttons (Run/Submit) */}
      {showActions && (onRun || onSubmit) && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Shortcuts: Ctrl+Enter (Run) • Ctrl+Shift+Enter (Submit) • Ctrl+S (Save)
          </div>
          <div className="flex items-center space-x-2">
            {onRun && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRun}
                title="Run Code (Ctrl+Enter)"
              >
                Run Code
              </Button>
            )}
            {onSubmit && (
              <Button
                variant="primary"
                size="sm"
                onClick={onSubmit}
                title="Submit Solution (Ctrl+Shift+Enter)"
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
        {editorComponent}
      </div>
    );
  }

  return editorComponent;
}