
export function getNotes() {
  const raw = JSON.parse(localStorage.getItem('notes') || '[]');
  return raw.map(n => {
    if (typeof n === 'string') {
      const now = new Date().toISOString();
      return { text: n, created: now, edited: now };
    }
    return {
      text: n.text || '',
      created: n.created || new Date().toISOString(),
      edited: n.edited || n.created || new Date().toISOString()
    };
  });
}

export function saveNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

export function getHeader() {
  return localStorage.getItem('noteHeader') || 'Rename Me';
}

export function saveHeader(value) {
  localStorage.setItem('noteHeader', value);
}
