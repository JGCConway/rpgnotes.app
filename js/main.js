import { loadHeader, loadNotes, editField } from './ui.js';
import { getNotes, saveNotes, getHeader, saveHeader } from './storage.js';

window.addEventListener('DOMContentLoaded', () => {
  // Add Note
  document.getElementById('add-note-btn')?.addEventListener('click', () => {
    document.getElementById('new-note').style.display = 'block';
    document.getElementById('note-text').focus();
  });

  // Save New Note
  document.getElementById('save-note-btn')?.addEventListener('click', () => {
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

  // Sorting Dropdown
  document.getElementById('sort-notes')?.addEventListener('change', (e) => {
    loadNotes(e.target.value);
  });

  // Rename H1 Field
  document.getElementById('renameField')?.addEventListener('click', editField);

  // Download All Notes
  document.getElementById('download-notes-btn')?.addEventListener('click', () => {
    const data = {
      header: getHeader(),
      notes: getNotes()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-notes.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Upload Notes
  const uploadInput = document.getElementById('upload-notes-input');
  document.getElementById('upload-notes-btn')?.addEventListener('click', () => {
    uploadInput.click();
  });

  uploadInput?.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        if (data.header) saveHeader(data.header);
        if (Array.isArray(data.notes)) saveNotes(data.notes);
        loadHeader();
        loadNotes(document.getElementById('sort-notes')?.value || 'created-asc');
      } catch (err) {
        alert('Invalid file format');
      }
    };

    reader.readAsText(file);
  });

  // Initial load
  loadHeader();
  loadNotes(document.getElementById('sort-notes')?.value || 'created-asc');
});
