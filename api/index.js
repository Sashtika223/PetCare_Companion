// Vercel Serverless Function - wraps CommonJS Express app
let appHandler;

module.exports = async (req, res) => {
  try {
    if (!appHandler) {
      console.log('[API] DATABASE_URL:', !!process.env.DATABASE_URL);
      console.log('[API] JWT_SECRET:', !!process.env.JWT_SECRET);

      const appModule = require('../backend/dist/app.js');

      console.log('[API] Module type:', typeof appModule);
      console.log('[API] Module keys:', Object.keys(appModule).join(','));
      console.log('[API] default type:', typeof appModule.default);

      if (typeof appModule.default === 'function') {
        appHandler = appModule.default;
      } else if (typeof appModule === 'function') {
        appHandler = appModule;
      } else {
        throw new Error(
          `Express app not found. Module type=${typeof appModule}, ` +
          `default type=${typeof appModule.default}, ` +
          `keys=${Object.keys(appModule).join(',')}`
        );
      }

      console.log('[API] App loaded. Type:', typeof appHandler);
    }

    return appHandler(req, res);

  } catch (err) {
    console.error('[API] ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
};
