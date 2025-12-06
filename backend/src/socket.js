const { Server } = require('socket.io');

let io;

const setupSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET','POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);

    socket.on('joinTask', (taskId) => {
      socket.join(`task_${taskId}`);
    });

    socket.on('message', (data) => {
      // data: { taskId, from, text }
      io.to(`task_${data.taskId}`).emit('message', data);
    });

    socket.on('taskUpdate', (data) => {
      io.to(`task_${data.taskId}`).emit('taskUpdate', data);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.id);
    });
  });
};

module.exports = { setupSockets };
