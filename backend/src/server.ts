import app from './app.js';
import { initCronJobs } from './jobs/reminderEngine.js';

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Pet Care Companion Backend running on http://localhost:${PORT}`);
  initCronJobs();
});
