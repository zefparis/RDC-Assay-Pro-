const { execSync } = require('child_process');

console.log('🔍 Testing Next.js build...');

try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🏗️ Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
