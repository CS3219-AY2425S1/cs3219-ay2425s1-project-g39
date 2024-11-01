import { sublimeInit } from '@uiw/codemirror-theme-sublime';
import CodeMirror, { Extension, ViewUpdate } from '@uiw/react-codemirror';
import { Decoration, EditorView, WidgetType } from '@codemirror/view';

import './CodeEditor.css';
import classes from './CodeEditor.module.css';

interface CodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  extensions: Extension[];
  viewUpdateRef: React.MutableRefObject<ViewUpdate | null>;
  fakeCursorPositionRef: React.MutableRefObject<number>;
}

const customSublime = sublimeInit({
  settings: {
    background: 'var(--mantine-color-slate-9)',
  },
});

class FakeCursorWidget extends WidgetType {
  toDOM(): HTMLElement {
    const cursor = document.createElement('span');
    cursor.className = classes.fakeCursor; // Apply custom style for the fake cursor
    cursor.textContent = '|'; // Visual representation of the cursor
    return cursor;
  }

  eq(other: WidgetType): boolean {
    return other instanceof FakeCursorWidget;
  }
}

function CodeEditor({
  code,
  setCode,
  extensions,
  viewUpdateRef,
  fakeCursorPositionRef,
}: CodeEditorProps) {

  const onUpdate = (viewUpdate: ViewUpdate) => { 
    viewUpdateRef.current = viewUpdate;
  };

  // Create a fake cursor extension that updates based on the fakeCursorPositionRef
  const fakeCursorExtension: Extension = EditorView.decorations.of(() => {
    const position = fakeCursorPositionRef.current;
    return position >= 0 ? Decoration.set([Decoration.widget({ widget: new FakeCursorWidget() }).range(position)]) : Decoration.none;
  });

  return (
    <CodeMirror
      value={code}
      theme={customSublime}
      className={classes.codeMirror}
      extensions={[...extensions, fakeCursorExtension]}
      onChange={setCode}
      onUpdate={onUpdate}
    />
  );
}

export default CodeEditor;
