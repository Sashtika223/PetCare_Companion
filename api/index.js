// Vercel Serverless Function - wraps CommonJS Express app
let appHandler;

module.exports = async (req, res) => {
  if (appHandler) {
    return appHandler(req, res);
  }

  // Step 1: Try to load the module
  let appModule;
  try {
    appModule = require('../backend/dist/app.js');
  } catch (loadErr) {
    console.error('[API] require() failed:', loadErr.message);
    return res.status(500).json({
      stage: 'require',
      error: loadErr.message,
      code: loadErr.code || null,
    });
  }

  // Step 2: Extract the Express app
  console.log('[API] Module type:', typeof appModule);
  console.log('[API] Module keys:', Object.keys(appModule || {}).join(','));
  console.log('[API] .default type:', typeof appModule?.default);

  if (typeof appModule?.default === 'function') {
    appHandler = appModule.default;
  } else if (typeof appModule === 'function') {
    appHandler = appModule;
  } else {
    return res.status(500).json({
      stage: 'extract',
      moduleType: typeof appModule,
      defaultType: typeof appModule?.default,
      keys: Object.keys(appModule || {}).join(','),
    });
  }

  // Step 3: Handle the request
  try {
    return appHandler(req, res);
  } catch (runErr) {
    console.error('[API] Runtime error:', runErr.message);
    return res.status(500).json({ stage: 'runtime', error: runErr.message });
  }
};
