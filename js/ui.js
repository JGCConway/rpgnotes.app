
import { getNotes, saveNotes, getHeader, saveHeader } from './storage.js';
import { autoResize } from './utils.js';

function parseNoteDate(str) {
  return new Date(Date.parse(str));
}

function formatReadableDate(isoStr) {
  return new Date(isoStr).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function loadHeader() {
  const h2 = document.getElementById("renameField");
  h2.innerText = getHeader();
}

export function editField() {
  const h2 = document.getElementById("renameField");
  const currentText = h2.innerText;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.onkeydown = e => e.key === 'Enter' && input.blur();
  input.onblur = () => {
    const newValue = input.value.trim();
    h2.innerText = newValue || currentText;
    saveHeader(newValue || currentText);
    h2.onclick = editField;
  };
  h2.innerHTML = '';
  h2.appendChild(input);
  input.focus();
  input.select();
}

export function loadNotes(sortOption = 'created-asc') {
  const notesContainer = document.getElementById('notes-container');
  const notes = getNotes();

  notes.sort((a, b) => {
    const aCreated = parseNoteDate(a.created);
    const bCreated = parseNoteDate(b.created);
    const aEdited = parseNoteDate(a.edited || a.created);
    const bEdited = parseNoteDate(b.edited || b.created);
    if (sortOption === 'created-asc') return aCreated - bCreated;
    if (sortOption === 'created-desc') return bCreated - aCreated;
    if (sortOption === 'edited-desc') return bEdited - aEdited;
    return 0;
  });

  notesContainer.innerHTML = '';

  notes.forEach((note, index) => {
    const noteEl = document.createElement('div');
    noteEl.className = 'note';

    const meta = document.createElement('div');
    meta.innerHTML = `<small>Created: ${formatReadableDate(note.created)}<br/>Last Edited: ${formatReadableDate(note.edited)}</small>`;
    noteEl.appendChild(meta);

    const textarea = document.createElement('textarea');
    textarea.value = note.text;
    textarea.disabled = true;
    autoResize(textarea);
    noteEl.appendChild(textarea);

    const btnContainer = document.createElement('div');
    btnContainer.className = 'note-buttons';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn edit-btn';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'btn save-btn';
    saveBtn.style.display = 'none';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'btn delete-btn';

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download';
    downloadBtn.className = 'btn download-btn';

    editBtn.onclick = () => {
      textarea.disabled = false;
      textarea.focus();
      saveBtn.style.display = 'inline-block';
      editBtn.style.display = 'none';
    };

    saveBtn.onclick = () => {
      const currentNotes = getNotes();
      currentNotes[index].text = textarea.value.trim();
      currentNotes[index].edited = new Date().toISOString();
      saveNotes(currentNotes);
      loadNotes(document.getElementById('sort-notes')?.value || 'created-asc');
    };

    deleteBtn.onclick = () => {
      const currentNotes = getNotes();
      currentNotes.splice(index, 1);
      saveNotes(currentNotes);
      loadNotes(document.getElementById('sort-notes')?.value || 'created-asc');
    };

    downloadBtn.onclick = () => {
      const currentNotes = getNotes();
      const data = currentNotes[index];
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `note-${index + 1}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(saveBtn);
    btnContainer.appendChild(deleteBtn);
    btnContainer.appendChild(downloadBtn);

    noteEl.appendChild(btnContainer);
    notesContainer.appendChild(noteEl);
  });
}
