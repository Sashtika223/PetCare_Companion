#!/bin/bash
set -e

echo "📦 Installing backend dependencies (including devDependencies)..."
cd backend
npm install --include=dev

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🏗️ Building backend TypeScript..."
npx tsc

echo "✅ Backend build complete."
cd ..

echo "📦 Installing frontend dependencies..."
cd frontend
npm install --include=dev

echo "⚡ Building frontend..."
npm run build

echo "✅ Frontend build complete."
cd ..

echo "🚀 Full build complete!"
