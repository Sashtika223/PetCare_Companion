// Vercel Serverless Function - wraps Express app
// backend/dist/app.js is CommonJS (TypeScript compiled without "type":"module")
// so we use require() directly, not dynamic import()
let appHandler;

module.exports = async (req, res) => {
  try {
    if (!appHandler) {
      console.log('[API] Loading Express app...');
      console.log('[API] DATABASE_URL set:', !!process.env.DATABASE_URL);
      console.log('[API] JWT_SECRET set:', !!process.env.JWT_SECRET);

      // Use require() since the compiled output is CommonJS
      const mod = require('../backend/dist/app.js');
      // TypeScript compiles "export default app" to exports.default = app
      appHandler = mod.default || mod;

      console.log('[API] App type:', typeof appHandler);
      console.log('[API] Express app loaded successfully');
    }
    return appHandler(req, res);
  } catch (err) {
    console.error('[API] Fatal error loading app:', err.message);
    res.status(500).json({
      error: 'Server initialization failed',
      message: err.message
    });
  }
};
