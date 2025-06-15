#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Build script for support.js library
 */

console.log('🚀 Building support.js library...\n');

// Ensure dist directory exists
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Build steps
const buildSteps = [
  {
    name: 'Clean dist directory',
    command: 'rm -rf dist/*'
  },

  {
    name: 'Build with Rollup',
    command: 'npx rollup -c'
  },
  {
    name: 'Copy type definitions',
    command: 'cp -r types/* dist/ 2>/dev/null || :'
  }
];

// Execute build steps
async function build() {
  for (const step of buildSteps) {
    console.log(`📦 ${step.name}...`);
    
    try {
      await execCommand(step.command);
      console.log(`✅ ${step.name} completed\n`);
    } catch (error) {
      console.error(`❌ ${step.name} failed:`);
      console.error(error);
      process.exit(1);
    }
  }

  // Verify build output
  const builtFiles = [
    'dist/index.js',
    'dist/index.esm.js',
    'dist/utils.js',
    'dist/react.js',
    'dist/angular.js'
  ];

  console.log('🔍 Verifying build output...');
  const missingFiles = builtFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing build files:');
    missingFiles.forEach(file => console.error(`  - ${file}`));
    process.exit(1);
  }

  console.log('✅ All build files generated successfully!');
  
  // Show build summary
  console.log('\n📊 Build Summary:');
  builtFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      const size = (stats.size / 1024).toFixed(2);
      console.log(`  ${file}: ${size}KB`);
    }
  });

  console.log('\n🎉 Build completed successfully!');
}

/**
 * Execute a command and return a promise
 */
function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        console.log(stderr);
      }
      if (stdout) {
        console.log(stdout);
      }
      resolve();
    });
  });
}

// Run the build
build().catch(error => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
