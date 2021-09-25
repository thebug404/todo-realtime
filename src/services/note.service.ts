import { Id, Params, ServiceMethods } from "@feathersjs/feathers";
import { NotFound } from "@feathersjs/errors";

export enum Status {
  COMPLETED = "completed",
  PENDING = "pending"
}

export interface Note {
  id: Id;
  name: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export class NoteService implements Partial<ServiceMethods<Note>> {
  private notes: Note[] = [
    {
      id: 1,
      name: "Guns N' Roses",
      status: Status.COMPLETED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Motionless In White",
      status: Status.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  async create(
    data: Pick<Note, "name">,
    _?: Params
  ): Promise<Note> {
    const note: Note = {
      id: this.notes.length + 1,
      name: data.name,
      status: Status.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.notes.unshift(note);
    return note;
  }

  async find(_?: Params): Promise<Note[]> {
    return this.notes;
  }

  async get(id: Id, _?: Params) {
    const note: Note | undefined = this.notes.find(
      note => Number(note.id) === Number(id)
    );
    if (!note) throw new NotFound("The note does not exist.");
    return note;
  }

  async update(id: Id, data: Note, _?: Params): Promise<Note> {
    const index: number = this.notes.findIndex(
      note => Number(note.id) === Number(id)
    );
    if (index < 0) throw new NotFound("The note does not exist");

    const { createdAt }: Note = this.notes[index];
    const note: Note = {
      id,
      name: data.name,
      status: data.status,
      createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.notes.splice(index, 1, note);
    return note;
  }

  async patch(id: Id, data: Partial<Note>, _?: Params): Promise<Note> {
    const index: number = this.notes.findIndex(
      note => Number(note.id) === Number(id)
    );
    if (index < 0) throw new NotFound("The note does not exist");

    const note: Note = this.notes[index];
    data = Object.assign({ updatedAt: new Date().toISOString() }, data);

    const values = Object.keys(data).reduce((prev, curr) => {
      return { ...prev, [curr]: { value: data[curr as keyof Note] } };
    }, {});
    const notePatched: Note = Object.defineProperties(note, values);

    this.notes.splice(index, 1, notePatched);
    return note;
  }

  async remove(id: Id, _?: Params): Promise<Note> {
    const index: number = this.notes.findIndex(
      note => Number(note.id) === Number(id)
    );
    if (index < 0) throw new NotFound("The note does not exist");

    const note: Note = this.notes[index];
    this.notes.splice(index, 1);
    return note;
  }
}
