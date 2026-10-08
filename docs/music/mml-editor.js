// Pin the shared state dependency for every CodeMirror module. Different copies
// of @codemirror/state make extensions fail their instanceof checks.
import { EditorState } from 'https://esm.sh/@codemirror/state@6.7.5';
import {
  EditorView, highlightActiveLine, keymap, Decoration, ViewPlugin,
} from 'https://esm.sh/@codemirror/view@6.43.12?deps=@codemirror/state@6.7.5';
import {
  defaultKeymap, history, historyKeymap,
} from 'https://esm.sh/@codemirror/commands@6.11.1?deps=@codemirror/state@6.7.5';
import { search, searchKeymap } from 'https://esm.sh/@codemirror/search@6.5.11?deps=@codemirror/state@6.7.5';

// Highlight MML directly so CDN parser dependency copies cannot drop token colors.
function mmlDecorations(doc) {
  const text = doc.toString(), ranges = [];
  const pattern = /\/\*[\s\S]*?(?:\*\/|$)|\/\/[^\n]*|^[ \t]*#[^\n]*/gm;
  let match;
  while ((match = pattern.exec(text))) {
    const definition = /^[ \t]*#/.test(match[0]);
    ranges.push(Decoration.mark({
      attributes: { style: definition
        ? 'color:var(--mml-system);font-weight:600'
        : 'color:#b8b8b8;font-style:italic' }
    }).range(match.index, match.index + match[0].length));
  }
  return Decoration.set(ranges);
}
const mmlHighlightPlugin = ViewPlugin.fromClass(class {
  constructor(view) { this.decorations = mmlDecorations(view.state.doc); }
  update(update) {
    if (update.docChanged) this.decorations = mmlDecorations(update.state.doc);
  }
}, { decorations: plugin => plugin.decorations });

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
        mmlHighlightPlugin,
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
