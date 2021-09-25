// Instance my app.
const socket = io();
const app = feathers(socket);

// Configure transport with SocketIO.
app.configure(feathers.socketio(socket));

// Get my service.
const NoteService = app.service("notes");

// Listening events CRUD.
NoteService.on("created", note => {
  console.log("Created: ",  note);
});

NoteService.on("updated", note => {
  console.log("Updated: ",  note);
});

NoteService.on("patched", note => {
  console.log("Patched: ",  note);
});

NoteService.on("removed", note => {
  console.log("Remooved: ",  note);
});

// Get elements.
const form = document.getElementById("form");
const input = document.getElementById("input");

// Listen event.
form.addEventListener("submit", e => {
  e.preventDefault();

  const formdata = new FormData(form);
  const title = formdata.get("title");
  // Validate empty input.a
  if (!title) return false;

  // Create a new note.
  NoteService.create({ name: title });
  form.reset();
});
