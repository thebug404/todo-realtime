// Instance my app.
const socket = io();
const app = feathers(socket);

// Get elements DOM.
const form = document.getElementById("form");
const input = document.getElementById("input");

const btnRemove = document.querySelector(".btn-remove");

const boxCompleted = document.getElementById("box-completed");
const boxPending = document.getElementById("box-pending");
const boxTotal = document.getElementById("box-total");

// Configure transport with SocketIO.
app.configure(feathers.socketio(socket));

// Get note service.
const NoteService = app.service("notes");

// Sets values.
let noteIds = [];
let notes = [];

async function selectNotes(noteId) {
  const index = noteIds.findIndex(id => id === noteId);
  index < 0 ? noteIds.push(noteId) : noteIds.splice(index, 1);
  btnRemove.disabled = !noteIds.length;
}

function updateHeader(items) {
  const completed = items.filter(note => note.status).length;
  const pending = items.length - completed;
  
  boxCompleted.textContent = `Completed: ${ completed }`;
  boxPending.textContent = `Pending: ${ pending }`;
  boxTotal.textContent = `Total: ${ items.length }`;
}

function updateElement(noteId) {
  const note = notes.find(note => note.id === noteId);
  NoteService.patch(note.id, { status: !note.status });
}

class UI {
  createElement(note) {
    const element = document.createElement("li");
    element.className = "list-group-item border-0";
    element.id = note.id;
    element.innerHTML = `
    <div class="d-flex align-items-center">
      <div>
        <h6>
          <strong>${ note.name }</strong>
        </h6>
        <small class="m-0 text-muted">${ note.createdAt }</small>
      </div>
      <span class="spacer"></span>
      <div onclick="updateElement(${note.id})" class="mx-2 text-center text-${ note.status ? 'success' : 'danger' }">
        <i class='bx bx-${ note.status ? 'check-circle' : 'error' }'></i>
      </div>
      <div class="ms-2">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault"
            onclick="selectNotes(${ note.id })"
          >
        </div>
      </div>
    </div>
    `;
    return element;
  }

  /**
   * Insert the element at the beginning of the container.
   * @param {HTMLElement} container 
   * @param {HTMLElement} element 
   */
  insertElement(container, element) {
    container.insertAdjacentElement("afterbegin", element);
  }

  removeElement(id) {
    const element = document.getElementById(id);
    element.remove();
  }
}

// Instance UI
const container = document.getElementById("container");
const ui = new UI();

btnRemove.addEventListener("click", () => {
  if (confirm(`Se eliminaran ${ noteIds.length } notas ¿estas seguro?`)) {
    noteIds.forEach(id => NoteService.remove(id));
    btnRemove.disabled = true;
    noteIds = [];
  }
});

// Listening events CRUD.
NoteService.on("created", note => {
  const element = ui.createElement(note);
  ui.insertElement(container, element);
  
  notes.push(note);
  updateHeader(notes);
});

NoteService.on("updated", note => {
  // I leave this method for you as homework.
  console.log("Updated: ",  note);
  updateHeader(notes);
});

NoteService.on("patched", note => {
  // Remove old element.
  ui.removeElement(note.id);
  // Create element updated.
  const element = ui.createElement(note);
  ui.insertElement(container, element);
  // Update header.
  updateHeader(notes);
});

NoteService.on("removed", note => {
  ui.removeElement(note.id);

  const index = notes.findIndex(note => note.id === note.id);
  notes.splice(index, 1);
  updateHeader(notes);
});

// Initialize values.
(async () => {
  // Get lits of note.
  notes = await NoteService.find();
  notes.forEach(note => {
    const element = ui.createElement(note);
    ui.insertElement(container, element);
  });
  // Update header.
  updateHeader(notes);
  // Button for remove is disable.
  btnRemove.disabled = true;
})();

// Listen event.
form.addEventListener("submit", e => {
  e.preventDefault();

  const formdata = new FormData(form);
  const title = formdata.get("title");
  if (!title) return false;

  NoteService.create({ name: title });
  form.reset();
});
