const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT || 5000;
// const message = "newChatMessage";

io.on("connection", (socket) => {
  console.log('Client '+ socket.id +' connected');

  // Join a conversation(Room id is sent as a query from client)
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on('message', (data) => {
    io.in(roomId).emit('message', data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log('Client '+ socket.id +' diconnected');
    socket.leave(roomId);
  });
});

server.listen(port, () => {
  console.log('Listening on port '+ port);
});
