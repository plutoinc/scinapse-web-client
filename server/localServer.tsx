import app from './express';

const port: number = Number(process.env.PORT) || 3000;

app
  .listen(port, () => console.log(`Express server listening at ${port}! Visit https://localhost:${port}`))
  .on('error', err => console.error('LOCAL_SERVER_ERROR =======================', err));
