const { execSync } = require('child_process');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');

console.log('Building frontend...');
console.log(`Frontend directory: ${frontendDir}`);

try {
  process.chdir(frontendDir);
  console.log('Changed to frontend directory');
  
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
