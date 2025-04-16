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
  const raw = JSON.parse(localStorage.getItem('notes') || '[]');
  return raw.map(n => {
    if (typeof n === 'string') {
      const now = new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
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
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
      saveNotes(notes);
      textarea.disabled = true;
      textarea.style.resize = 'none';
      setTimeout(loadNotes, 0); // reload to update timestamps
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
    const now = new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
    notes.push({
      text,
      created: now,
      edited: now
    });
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