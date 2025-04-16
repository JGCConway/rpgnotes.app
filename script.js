// =======================
// ✨ DOM ELEMENTS
// =======================
const addNoteBtn = document.getElementById('add-note-btn');
const newNoteSection = document.getElementById('new-note');
const saveNoteBtn = document.getElementById('save-note-btn');
const noteText = document.getElementById('note-text');
const notesContainer = document.getElementById('notes-container');
const downloadBtn = document.getElementById('download-notes-btn');
const uploadInput = document.getElementById('upload-notes-input');
const uploadBtn = document.getElementById('upload-notes-btn');
const sortDropdown = document.getElementById('sort-notes');

// =======================
// 🧠 UTILITY FUNCTIONS
// =======================
function parseNoteDate(str) {
  return new Date(Date.parse(str));
}

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = (textarea.scrollHeight || 60) + 'px';
}

// =======================
// 📦 STORAGE FUNCTIONS
// =======================
function getNotes() {
  const raw = JSON.parse(localStorage.getItem('notes') || '[]');
  return raw.map(n => {
    if (typeof n === 'string') {
      const now = new Date().toLocaleString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit'
      });
      return { text: n, created: now, edited: now };
    }
    return {
      text: n.text || '',
      created: n.created || '',
      edited: n.edited || n.created || ''
    };
  });
}

function saveNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function getHeader() {
  return localStorage.getItem('noteHeader') || 'Rename Me';
}

function saveHeader(value) {
  localStorage.setItem('noteHeader', value);
}

// =======================
// 🖼️ RENDER FUNCTIONS
// =======================
function loadHeader() {
  const h2 = document.getElementById("renameField");
  h2.innerText = getHeader();
}

function loadNotes(sortOption = 'created-asc') {
  notesContainer.innerHTML = '';
  const notes = getNotes();

  notes.sort((a, b) => {
    const aCreated = parseNoteDate(a.created);
    const bCreated = parseNoteDate(b.created);
    const aEdited = parseNoteDate(a.edited || a.created);
    const bEdited = parseNoteDate(b.edited || b.created);

    if (sortOption === 'created-asc') return aCreated - bCreated;
    if (sortOption === 'created-desc') return bCreated - aCreated;
    if (sortOption === 'edited-desc') return bEdited - aEdited;
    if (sortOption === 'edited-asc') return aEdited - bEdited;
    return 0;
  });

  notes.forEach((note, index) => {
    const noteEl = document.createElement('div');
    noteEl.className = 'note';

    const timeEl = document.createElement('div');
    timeEl.style.fontSize = '0.8em';
    timeEl.style.color = '#555';
    timeEl.style.marginBottom = '5px';
    timeEl.innerHTML = `
      <div><strong>Created:</strong> ${note.created}</div>
      <div><strong>Last Edited:</strong> ${note.edited}</div>
    `;
    noteEl.appendChild(timeEl);

    const textarea = document.createElement('textarea');
    textarea.value = note.text;
    textarea.disabled = true;
    textarea.addEventListener('input', () => autoResize(textarea));

    const btnContainer = document.createElement('div');
    btnContainer.className = 'note-buttons';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn edit-btn';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'btn delete-btn';

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download';
    downloadBtn.className = 'btn';
    downloadBtn.style.background = '#969696';
    downloadBtn.style.color = 'white';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'btn save-btn';
    saveBtn.style.display = 'none';

    editBtn.onclick = () => {
      textarea.disabled = false;
      textarea.focus();
      saveBtn.style.display = 'inline-block';
      editBtn.style.display = 'none';
    };

    saveBtn.onclick = () => {
      notes[index].text = textarea.value.trim();
      notes[index].edited = new Date().toLocaleString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit'
      });
      saveNotes(notes);
      textarea.disabled = true;
      textarea.style.resize = 'none';
      loadNotes(sortDropdown?.value || 'created-asc');
    };

    deleteBtn.onclick = () => {
      notes.splice(index, 1);
      saveNotes(notes);
      loadNotes(sortDropdown?.value || 'created-asc');
    };

    downloadBtn.onclick = () => {
      const data = {
        text: notes[index].text,
        created: notes[index].created,
        edited: notes[index].edited
      };
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
    btnContainer.appendChild(downloadBtn);
    btnContainer.appendChild(deleteBtn);

    noteEl.appendChild(timeEl);
    noteEl.appendChild(textarea);
    noteEl.appendChild(btnContainer);
    notesContainer.appendChild(noteEl);

    autoResize(textarea);
  });
}

// =======================
// ➕ INTERACTION FUNCTIONS
// =======================
function saveNote() {
  const text = noteText.value.trim();
  if (text) {
    const now = new Date().toLocaleString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
    const notes = getNotes();
    notes.push({ text, created: now, edited: now });
    saveNotes(notes);
    noteText.value = '';
    newNoteSection.style.display = 'none';
    loadNotes(sortDropdown?.value || 'created-asc');
  }
}

function editField() {
  const h2 = document.getElementById("renameField");
  const currentText = h2.innerText;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;

  input.onkeydown = function (event) {
    if (event.key === 'Enter') input.blur();
  };

  input.onblur = function () {
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

// =======================
// 📁 FILE HANDLING
// =======================
function downloadNotes() {
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
}

function uploadNotes(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.header) saveHeader(data.header);
      if (Array.isArray(data.notes)) saveNotes(data.notes);
      loadHeader();
      loadNotes(sortDropdown?.value || 'created-asc');
    } catch (err) {
      alert('Invalid file format');
    }
  };
  reader.readAsText(file);
}

// =======================
// 🚀 INIT ON LOAD
// =======================
window.addEventListener('DOMContentLoaded', () => {
  addNoteBtn.addEventListener('click', () => {
    newNoteSection.style.display = 'block';
    noteText.focus();
  });

  saveNoteBtn.addEventListener('click', saveNote);
  noteText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveNote();
    }
  });
  noteText.addEventListener('input', () => autoResize(noteText));

  downloadBtn.addEventListener('click', downloadNotes);
  uploadBtn.addEventListener('click', () => uploadInput.click());
  uploadInput.addEventListener('change', uploadNotes);

  sortDropdown?.addEventListener('change', (e) => {
    loadNotes(e.target.value);
  });

  loadHeader();
  loadNotes(sortDropdown?.value || 'created-asc');
});






