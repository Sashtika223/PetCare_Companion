// Vercel Serverless Function - wraps Express app
// Must use dynamic import since backend uses ESModules (NodeNext)
let appHandler;

module.exports = async (req, res) => {
  try {
    if (!appHandler) {
      console.log('[API] Loading Express app...');
      console.log('[API] DATABASE_URL set:', !!process.env.DATABASE_URL);
      console.log('[API] JWT_SECRET set:', !!process.env.JWT_SECRET);
      const mod = await import('../backend/dist/app.js');
      appHandler = mod.default;
      console.log('[API] Express app loaded successfully');
    }
    return appHandler(req, res);
  } catch (err) {
    console.error('[API] Fatal error loading app:', err);
    res.status(500).json({
      error: 'Server initialization failed',
      message: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  }
};
