import app from './app.js';
import { PORT, FLASK_URL } from './config.js';

app.listen(PORT, () => {
  console.log(`AgriGuard backend running on port ${PORT}`);
  console.log(`Forwarding predictions to ${FLASK_URL}`);
});
