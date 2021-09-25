import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio";
import express from "@feathersjs/express";
import "@feathersjs/transport-commons";
import { resolve } from "path";

import { NoteService } from "./services/note.service";

const app = express(feathers());

// Allows interpreting json requests.
app.use(express.json());
// Allows interpreting urlencoded requests.
app.use(express.urlencoded({ extended: true }));
// Add support REST-API.
app.configure(express.rest());
// Add support Real-Time
app.configure(socketio());

// Define my service.
app.use("/notes", new NoteService());

// Server static files.
app.use(express.static(resolve("public")));

// Use error not found.
app.use(express.notFound());
// We configure the errors to send a json.
app.use(express.errorHandler({ html: false }));

// We listen connection event and join the channel.
app.on("connection", connection =>
  app.channel("everyone").join(connection)
);

// Publish all events to channel <everyone>
app.publish(() => app.channel("everyone"));

app.listen(3030, () => {
  console.log("App execute in http://localhost:3030");
});
