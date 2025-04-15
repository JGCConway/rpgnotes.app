const addNoteBtn = document.getElementById('add-note-btn');
const newNoteSection = document.getElementById('new-note');
const saveNoteBtn = document.getElementById('save-note-btn');
const noteText = document.getElementById('note-text');
const notesContainer = document.getElementById('notes-container');
const downloadBtn = document.getElementById('download-notes-btn');
const uploadInput = document.getElementById('upload-notes-input');
const uploadBtn = document.getElementById('upload-notes-btn');

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = (textarea.scrollHeight || 60) + 'px';
}

function getNotes() {
  return JSON.parse(localStorage.getItem('notes') || '[]');
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

function loadHeader() {
  const h2 = document.getElementById("renameField");
  h2.innerText = getHeader();
}

function editField() {
  let h2 = document.getElementById("renameField");
  let currentText = h2.innerText;
  let input = document.createElement("input");
  input.type = "text";
  input.value = currentText;

  input.onkeydown = function(event) {
    if (event.key === 'Enter') {
      input.blur();
    }
  };

  input.onblur = function() {
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

function loadNotes() {
  notesContainer.innerHTML = '';
  const notes = getNotes();

  notes.forEach((note, index) => {
    const noteEl = document.createElement('div');
    noteEl.className = 'note';

    const textarea = document.createElement('textarea');
    textarea.value = note;
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
      notes[index] = textarea.value.trim();
      saveNotes(notes);
      textarea.disabled = true;
      textarea.style.resize = 'none';
      setTimeout(loadNotes, 0);
    };

    deleteBtn.onclick = () => {
      notes.splice(index, 1);
      saveNotes(notes);
      loadNotes();
    };

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(saveBtn);
    btnContainer.appendChild(deleteBtn);

    noteEl.appendChild(textarea);
    noteEl.appendChild(btnContainer);
    notesContainer.appendChild(noteEl);

    autoResize(textarea);
  });

  setTimeout(() => {
    document.querySelectorAll('.note textarea').forEach(autoResize);
  }, 0);
}

function saveNote() {
  const text = noteText.value.trim();
  if (text) {
    const notes = getNotes();
    notes.push(text);
    saveNotes(notes);
    noteText.value = '';
    newNoteSection.style.display = 'none';
    loadNotes();
  }
}

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
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.header) saveHeader(data.header);
      if (Array.isArray(data.notes)) saveNotes(data.notes);
      loadHeader();
      loadNotes();
    } catch (err) {
      alert('Invalid file format');
    }
  };
  reader.readAsText(file);
}

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

loadHeader();
loadNotes();