/* eslint-disable linebreak-style */

require("dotenv").config();

const Hapi = require("@hapi/hapi");

// notes
const notes = require("./api/notes");
const NotesService = require("./service/postgres/NotesService");
const NotesValidator = require("./validator/notes");

// ClientError
const ClientError = require("./exceptions/ClientError");

// users
const users = require("./api/users");
const UsersService = require("./service/postgres/UsersService");
const UsersValidator = require("./validator/users");

const init = async () => {
  const notesService = new NotesService();
  const usersService = new UsersService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
