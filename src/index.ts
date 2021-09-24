import feathers from "@feathersjs/feathers";
import express, { Application } from "@feathersjs/express";

import { NoteService } from "./services/note.service";

const app: Application = express(feathers());

// Allows interpreting json requests.
app.use(express.json());
// Allows interpreting urlencoded requests.
app.use(express.urlencoded({ extended: true }));
// Add support REST-API.
app.configure(express.rest());

// Define my service.
app.use("/notes", new NoteService());

// Use error not found.
app.use(express.notFound());
// We configure the errors to send a json.
app.use(express.errorHandler({ html: false }));

app.listen(3030, () => {
  console.log("App execute in http://localhost:3030");
});
