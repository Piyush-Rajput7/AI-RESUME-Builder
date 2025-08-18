#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AI Resume Builder development servers...\n');

// Start backend server
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '../backend'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

// Start frontend server
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '../frontend'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

// Handle backend output
backend.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data.toString().trim()}`);
});

// Handle frontend output
frontend.stdout.on('data', (data) => {
  console.log(`[Frontend] ${data.toString().trim()}`);
});

frontend.stderr.on('data', (data) => {
  console.error(`[Frontend Error] ${data.toString().trim()}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});

frontend.on('close', (code) => {
  console.log(`Frontend process exited with code ${code}`);
});

console.log('✅ Development servers started!');
console.log('📱 Frontend: http://localhost:5173');
console.log('🔧 Backend: http://localhost:3001');
console.log('Press Ctrl+C to stop both servers');