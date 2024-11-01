import { sublimeInit } from '@uiw/codemirror-theme-sublime';
import CodeMirror, { Extension, ViewUpdate } from '@uiw/react-codemirror';
import { EditorView } from "@codemirror/view";

import './CodeEditor.css';
import classes from './CodeEditor.module.css';
import { addCursor, cursorExtension } from "./utils/cursors";

interface CodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  extensions: Extension[];
  viewUpdateRef: React.MutableRefObject<ViewUpdate | null>;
}

const customSublime = sublimeInit({
  settings: {
    background: 'var(--mantine-color-slate-9)',
  },
});

function CodeEditor({
  code,
  setCode,
  extensions,
  viewUpdateRef,
}: CodeEditorProps) {

  const updateViewUpdateRef = (viewUpdate: ViewUpdate) => { 
    viewUpdateRef.current = viewUpdate;
  };

  // Add a cursor at position 0 when the component mounts
  const cursorAtStart = cursorExtension("fakeCursor"); // Optionally pass an ID for the cursor
  const cursorEffect = EditorView.updateListener.of(update => {
    if (update.docChanged) {
      // Dispatch addCursor effect for position 0
      update.view.dispatch({
        effects: addCursor.of({ id: "fakeCursor", from: 0, to: 0 })
      });
    }
  });

  return (
    <CodeMirror
      value={code}
      theme={customSublime}
      className={classes.codeMirror}
      extensions={[...extensions, cursorAtStart, cursorEffect]} // Add the cursor extension and effect
      onChange={setCode}
      onUpdate={updateViewUpdateRef}
    />
  );
}

export default CodeEditor;
