const app = require('./app');

const PORT = process.env.PORT || 3002;

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof PORT === 'string'
    ? `Pipe ${PORT}`
    : `Port ${PORT}`;

  switch (error.code) {
    case 'EACCESS':
      console.error(`${bind} requires elevated privilges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
app.on('error', onError);
