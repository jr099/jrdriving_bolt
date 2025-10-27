import { app } from './app';
import { env } from './env';

const PORT = env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT} (env: ${env.NODE_ENV})`);
});
