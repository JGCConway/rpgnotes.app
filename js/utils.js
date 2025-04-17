
export function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = (textarea.scrollHeight || 60) + 'px';
}

export function parseNoteDate(str) {
  return new Date(Date.parse(str));
}
