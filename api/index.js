// Vercel Serverless Function - wraps Express app
// @ts-nocheck
const app = require('../backend/dist/app.js').default;
module.exports = app;
