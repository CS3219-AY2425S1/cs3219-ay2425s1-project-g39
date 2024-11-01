import { sublimeInit } from '@uiw/codemirror-theme-sublime';
import CodeMirror, { Extension, ViewUpdate } from '@uiw/react-codemirror';
import { Decoration, EditorView, WidgetType } from '@codemirror/view';
import { useRef } from 'react';

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
    cursor.className = classes.fakeCursor;
    cursor.textContent = '|';
    // You can use the position if you need it for something, 
    // but currently, it's not necessary for rendering.
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
  const editorRef = useRef<EditorView | null>(null);

  const onUpdate = (viewUpdate: ViewUpdate) => { 
    viewUpdateRef.current = viewUpdate;
  };

  const fakeCursorExtension: Extension = EditorView.decorations.of(() => {
    const position = fakeCursorPositionRef.current;
    return position >= 0 ? Decoration.set([Decoration.widget({ widget: new FakeCursorWidget() }).range(position)]) : Decoration.none;
  });

  return (
    <CodeMirror
      ref={editorRef}
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
