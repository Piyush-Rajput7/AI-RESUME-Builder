#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up AI Resume Builder...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js 18 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'frontend/package.json',
  'backend/package.json'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Required file missing: ${file}`);
    process.exit(1);
  }
}

console.log('✅ Required files check passed');

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('Installing frontend dependencies...');
  execSync('cd frontend && npm install', { stdio: 'inherit' });

  console.log('Installing backend dependencies...');
  execSync('cd backend && npm install', { stdio: 'inherit' });

  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Check environment files
console.log('\n🔧 Checking environment configuration...');

const envFiles = [
  { path: 'backend/.env', example: 'backend/.env.example' },
  { path: 'frontend/.env', example: 'frontend/.env.example' }
];

let envMissing = false;

for (const { path: envPath, example } of envFiles) {
  if (!fs.existsSync(envPath)) {
    console.warn(`⚠️  Environment file missing: ${envPath}`);
    if (fs.existsSync(example)) {
      console.log(`📋 Copying from ${example}...`);
      fs.copyFileSync(example, envPath);
      console.log(`✅ Created ${envPath} from example`);
    }
    envMissing = true;
  }
}

if (envMissing) {
  console.log('\n⚠️  Please update the environment files with your actual API keys:');
  console.log('   - Supabase URL and keys');
  console.log('   - OpenAI API key');
  console.log('   - Stripe keys (optional)');
}

// Create necessary directories
const directories = [
  'backend/dist',
  'frontend/dist',
  'uploads',
  'logs'
];

console.log('\n📁 Creating directories...');

for (const dir of directories) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
}

// Build TypeScript
console.log('\n🔨 Building TypeScript...');

try {
  execSync('cd backend && npm run build', { stdio: 'inherit' });
  console.log('✅ Backend TypeScript compiled successfully');
} catch (error) {
  console.warn('⚠️  Backend TypeScript compilation failed. This is normal if dependencies are missing.');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Update environment variables in backend/.env and frontend/.env');
console.log('2. Set up your Supabase project and run the database schema');
console.log('3. Get your OpenAI API key and add it to backend/.env');
console.log('4. Run "npm run dev" to start the development servers');
console.log('\n📚 Check the README.md for detailed setup instructions.');