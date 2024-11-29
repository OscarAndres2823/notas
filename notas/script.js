document.addEventListener("DOMContentLoaded", () => {
    const noteForm = document.getElementById("noteForm");
    const notesContainer = document.getElementById("notesContainer");

    // Función para cargar notas desde localStorage
    const loadNotes = () => {
      notesContainer.innerHTML = "";
      const notes = JSON.parse(localStorage.getItem("notes")) || [];
      notes.forEach((note, index) => {
        const noteElement = document.createElement("div");
        noteElement.classList.add("note");
        noteElement.style.backgroundColor = note.color;
        noteElement.innerHTML = `
          <h3>${note.title}</h3>
          <p>${note.content}</p>
          <p>Alarma: ${note.alarm ? new Date(note.alarm).toLocaleString() : "No establecida"}</p>
          <div class="actions">
            <button class="edit" onclick="editNote(${index})">Editar</button>
            <button class="delete" onclick="deleteNote(${index})">Eliminar</button>
          </div>
        `;
        notesContainer.appendChild(noteElement);
      });
    };

    // Función para agregar una nueva nota
    const addNote = (title, content, color, alarm) => {
      const notes = JSON.parse(localStorage.getItem("notes")) || [];
      notes.push({ title, content, color, alarm });
      localStorage.setItem("notes", JSON.stringify(notes));
      loadNotes();
    };

    // Al enviar el formulario, agregar la nota
    noteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("noteTitle").value;
      const content = document.getElementById("noteContent").value;
      const color = document.getElementById("noteColor").value;
      const alarm = document.getElementById("alarmTime").value ? new Date(document.getElementById("alarmTime").value).toISOString() : null;
      addNote(title, content, color, alarm);
      noteForm.reset();
    });

    // Función para eliminar una nota
    window.deleteNote = (index) => {
      const notes = JSON.parse(localStorage.getItem("notes"));
      notes.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(notes));
      loadNotes();
    };

    // Función para editar una nota
    window.editNote = (index) => {
      const notes = JSON.parse(localStorage.getItem("notes"));
      const note = notes[index];
      document.getElementById("noteTitle").value = note.title;
      document.getElementById("noteContent").value = note.content;
      document.getElementById("noteColor").value = note.color;
      document.getElementById("alarmTime").value = note.alarm ? new Date(note.alarm).toISOString().slice(0, 16) : "";
      deleteNote(index);
    };

    // Función para revisar las alarmas
    const checkAlarms = () => {
      const notes = JSON.parse(localStorage.getItem("notes")) || [];
      const now = new Date().toISOString();

      notes.forEach((note, index) => {
        if (note.alarm && note.alarm <= now) {
          alert(`¡Alarma! Es hora de revisar tu nota: "${note.title}"`);
          note.alarm = null; // Desactivar alarma después de mostrar la notificación
        }
      });

      localStorage.setItem("notes", JSON.stringify(notes));
    };

    // Verificar alarmas cada minuto
    setInterval(checkAlarms, 60000); // Verificar alarmas cada 60 segundos

    loadNotes();
});
