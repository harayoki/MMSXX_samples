import { EditorState } from 'https://esm.sh/@codemirror/state@6.7.5';
import {
  EditorView, drawSelection, highlightActiveLine, keymap,
} from 'https://esm.sh/@codemirror/view@6.43.12';
import {
  defaultKeymap, history, historyKeymap,
} from 'https://esm.sh/@codemirror/commands@6.11.1';
import {
  HighlightStyle, StreamLanguage, syntaxHighlighting,
} from 'https://esm.sh/@codemirror/language@6.12.4';
import { tags } from 'https://esm.sh/@lezer/highlight@1.2.3';

// 試作では行頭（空白可）の // コメントだけを認識する。
const mmlComments = StreamLanguage.define({
  token(stream) {
    if (stream.sol() && stream.match(/^\s*\/\//)) {
      stream.skipToEnd();
      return 'comment';
    }
    stream.skipToEnd();
    return null;
  },
});

const mmlHighlight = HighlightStyle.define([
  { tag: tags.comment, color: '#a8d69a', fontStyle: 'italic' },
]);

export function mountMMLEditor(host, source, options = {}) {
  const mirror = options.mirror ?? null;
  const commit = value => options.onCommit?.(value);
  let dirty = false;

  const view = new EditorView({
    parent: host,
    state: EditorState.create({
      doc: source,
      extensions: [
        history(),
        drawSelection(),
        highlightActiveLine(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        mmlComments,
        syntaxHighlighting(mmlHighlight),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({
          'aria-label': options.label ?? 'MMLソース',
          spellcheck: 'false',
        }),
        EditorView.updateListener.of(update => {
          if (!update.docChanged) return;
          dirty = true;
          if (mirror) mirror.value = update.state.doc.toString();
        }),
        EditorView.domEventHandlers({
          blur(_event, currentView) {
            if (!dirty) return false;
            dirty = false;
            commit(currentView.state.doc.toString());
            return false;
          },
        }),
      ],
    }),
  });

  if (mirror) mirror.value = source;
  return {
    view,
    getValue: () => view.state.doc.toString(),
    focus: () => view.focus(),
    destroy: () => view.destroy(),
  };
}
