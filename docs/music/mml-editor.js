// Pin the shared state dependency for every CodeMirror module. Different copies
// of @codemirror/state make extensions fail their instanceof checks.
import { EditorState } from 'https://esm.sh/@codemirror/state@6.7.5';
import {
  EditorView, highlightActiveLine, keymap,
} from 'https://esm.sh/@codemirror/view@6.43.12?deps=@codemirror/state@6.7.5';
import {
  defaultKeymap, history, historyKeymap,
} from 'https://esm.sh/@codemirror/commands@6.11.1?deps=@codemirror/state@6.7.5';
import {
  HighlightStyle, StreamLanguage, syntaxHighlighting,
} from 'https://esm.sh/@codemirror/language@6.12.4?deps=@codemirror/state@6.7.5';
import { search, searchKeymap } from 'https://esm.sh/@codemirror/search@6.5.11?deps=@codemirror/state@6.7.5';
import { tags } from 'https://esm.sh/@lezer/highlight@1.2.3';

// 行頭（空白可）の # はシステム行。// と /* ... */ は通常コメント。
const mmlComments = StreamLanguage.define({
  startState() {
    return { blockComment: false };
  },
  token(stream, state) {
    if (state.blockComment) {
      if (stream.skipTo('*/')) {
        stream.match('*/');
        state.blockComment = false;
      } else {
        stream.skipToEnd();
      }
      return 'comment';
    }
    if (stream.sol() && stream.match(/^\s*#/)) {
      stream.skipToEnd();
      return 'meta';
    }
    if (stream.match('//')) {
      stream.skipToEnd();
      return 'comment';
    }
    if (stream.match('/*')) {
      if (stream.skipTo('*/')) {
        stream.match('*/');
      } else {
        state.blockComment = true;
        stream.skipToEnd();
      }
      return 'comment';
    }
    while (!stream.eol()
      && !stream.match('//', false)
      && !stream.match('/*', false)) {
      stream.next();
    }
    return null;
  },
});

const mmlHighlight = HighlightStyle.define([
  { tag: tags.meta, color: 'var(--mml-system)', fontWeight: '600' },
  { tag: tags.comment, color: '#b8b8b8', fontStyle: 'italic' },
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
        search(),
        highlightActiveLine(),
        keymap.of([...defaultKeymap, ...searchKeymap, ...historyKeymap]),
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
    setValue(value) {
      const next = String(value ?? '');
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: next },
      });
      dirty = false;
      if (mirror) mirror.value = next;
    },
    focus: () => view.focus(),
    destroy: () => view.destroy(),
  };
}

export function mountMMLTextarea(textarea, source, options = {}) {
  const host = document.createElement('div');
  host.className = 'cm-mml-shell';
  host.style.backgroundImage = textarea.style.backgroundImage;
  textarea.before(host);
  textarea.hidden = true;
  textarea.disabled = false;
  return mountMMLEditor(host, source, {
    ...options,
    mirror: textarea,
    label: textarea.getAttribute('aria-label') || 'MMLソース',
  });
}
