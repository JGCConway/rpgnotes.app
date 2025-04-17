
import { loadHeader, loadNotes, editField } from './ui.js';
import { getNotes, saveNotes } from './storage.js';

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add-note-btn').addEventListener('click', () => {
    document.getElementById('new-note').style.display = 'block';
    document.getElementById('note-text').focus();
  });

  document.getElementById('save-note-btn').addEventListener('click', () => {
    const text = document.getElementById('note-text').value.trim();
    if (text) {
      const now = new Date().toISOString();
      const notes = getNotes();
      notes.push({ text, created: now, edited: now });
      saveNotes(notes);
      document.getElementById('note-text').value = '';
      document.getElementById('new-note').style.display = 'none';
      loadNotes(document.getElementById('sort-notes')?.value || 'created-asc');
    }
  });

  document.getElementById('sort-notes')?.addEventListener('change', (e) => {
    loadNotes(e.target.value);
  });

  loadHeader();
  loadNotes(document.getElementById('sort-notes')?.value || 'created-asc');
});
