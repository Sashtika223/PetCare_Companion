// Vercel Serverless Function - wraps Express app
// Must use dynamic import since backend uses ESModules (NodeNext)
let appHandler;

module.exports = async (req, res) => {
  if (!appHandler) {
    const mod = await import('../backend/dist/app.js');
    appHandler = mod.default;
  }
  return appHandler(req, res);
};
