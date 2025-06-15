#!/usr/bin/env node

/**
 * Support.js Framework - Universal Installer
 * Installs the framework with all framework dependencies in one command
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FRAMEWORK_DEPENDENCIES = {
  react: ['react', 'react-dom'],
  nextjs: ['next', 'react', 'react-dom'],
  angular: ['@angular/core', '@angular/common', 'rxjs'],
  all: ['react', 'react-dom', 'next', '@angular/core', '@angular/common', 'rxjs']
};

const log = {
  info: (msg) => console.log('ℹ', msg),
  success: (msg) => console.log('✓', msg),
  warn: (msg) => console.log('⚠', msg),
  error: (msg) => console.log('✗', msg),
  step: (msg) => console.log('→', msg)
};

function detectPackageManager() {
  if (fs.existsSync('yarn.lock')) return 'yarn';
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
  return 'npm';
}

function detectExistingFrameworks() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return [];
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const frameworks = [];
  
  if (dependencies.react || dependencies['react-dom']) {
    frameworks.push('react');
  }
  
  if (dependencies.next) {
    frameworks.push('nextjs');
  }
  
  if (dependencies['@angular/core'] || dependencies['@angular/common']) {
    frameworks.push('angular');
  }
  
  return frameworks;
}

function getInstallCommand(packageManager, packages) {
  switch (packageManager) {
    case 'yarn':
      return `yarn add ${packages.join(' ')}`;
    case 'pnpm':
      return `pnpm add ${packages.join(' ')}`;
    default:
      return `npm install ${packages.join(' ')}`;
  }
}

function installPackages(packages, packageManager) {
  const command = getInstallCommand(packageManager, packages);
  
  log.step(`Installing packages: ${packages.join(', ')}`);
  log.info(`Using ${packageManager}: ${command}`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log.error(`Installation failed: ${error.message}`);
    return false;
  }
}

function createExampleFiles(frameworks) {
  log.step('Creating example usage files...');
  
  const examplesDir = path.join(process.cwd(), 'support-js-examples');
  
  if (!fs.existsSync(examplesDir)) {
    fs.mkdirSync(examplesDir, { recursive: true });
  }
  
  // Core utilities example
  const coreExample = `// Core utilities example
import { 
  formatDate, 
  formatCurrency, 
  isEmail, 
  hexToRgb, 
  debounce,
  unique,
  deepClone 
} from 'support-js-framework/core';

// Date formatting
const today = formatDate(new Date(), 'YYYY-MM-DD');
console.log('Today:', today);

// Email validation
const isValid = isEmail('user@example.com');
console.log('Email valid:', isValid);

// Currency formatting
const price = formatCurrency(1234.56, { currency: 'USD' });
console.log('Price:', price);

// Color manipulation
const rgb = hexToRgb('#3498db');
console.log('RGB:', rgb);

// Array utilities
const numbers = [1, 2, 2, 3, 4, 4, 5];
const uniqueNumbers = unique(numbers);
console.log('Unique numbers:', uniqueNumbers);
`;
  
  fs.writeFileSync(path.join(examplesDir, 'core-example.js'), coreExample);
  
  // Framework-specific examples
  if (frameworks.includes('react')) {
    const reactExample = `import React, { useState } from 'react';
import { useDebounce, useLocalStorage, LazyImage } from 'support-js-framework/react';
import { formatCurrency, isEmail } from 'support-js-framework/core';

function App() {
  const [search, setSearch] = useLocalStorage('search', '');
  const [email, setEmail] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  const price = formatCurrency(1234.56, { currency: 'USD' });
  const emailValid = isEmail(email);
  
  return (
    <div>
      <h1>Support.js Framework + React</h1>
      
      <div>
        <label>Search (saved to localStorage):</label>
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
        <p>Debounced: {debouncedSearch}</p>
      </div>
      
      <div>
        <label>Email validation:</label>
        <input 
          type="email"
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
        <p>{emailValid ? '✓ Valid' : '✗ Invalid'}</p>
      </div>
      
      <div>
        <p>Formatted price: {price}</p>
        <LazyImage src="/example.jpg" alt="Example" />
      </div>
    </div>
  );
}

export default App;`;
    
    fs.writeFileSync(path.join(examplesDir, 'react-example.jsx'), reactExample);
  }
  
  if (frameworks.includes('nextjs')) {
    const nextjsExample = `import { GetServerSideProps } from 'next';
import { SSRStorage, generateMetaTags } from 'support-js-framework/nextjs';
import { formatDate } from 'support-js-framework/core';

export default function Page({ serverData, timestamp }) {
  return (
    <div>
      <h1>Support.js Framework + Next.js</h1>
      <p>Server data: {serverData}</p>
      <p>Generated at: {formatDate(new Date(timestamp), 'YYYY-MM-DD HH:mm:ss')}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Server-safe storage access
  const serverData = SSRStorage.getServer('key', 'default value');
  
  return {
    props: {
      serverData,
      timestamp: new Date().toISOString()
    }
  };
};`;
    
    fs.writeFileSync(path.join(examplesDir, 'nextjs-example.tsx'), nextjsExample);
  }
  
  if (frameworks.includes('angular')) {
    const angularExample = `import { Component, OnInit } from '@angular/core';
import { SupportLoggerService, SupportStorageService } from 'support-js-framework/angular';
import { formatCurrency, isEmail } from 'support-js-framework/core';

@Component({
  selector: 'app-example',
  template: \`
    <div>
      <h1>Support.js Framework + Angular</h1>
      
      <div>
        <label>Email:</label>
        <input [(ngModel)]="email" type="email">
        <p>{{ email | supportEmailValidation }}</p>
      </div>
      
      <div>
        <label>Amount:</label>
        <input [(ngModel)]="amount" type="number">
        <p>{{ amount | supportCurrency:'USD' }}</p>
      </div>
      
      <button (click)="saveData()">Save to Storage</button>
      <button (click)="logInfo()">Log Info</button>
    </div>
  \`
})
export class ExampleComponent implements OnInit {
  email = '';
  amount = 1234.56;
  
  constructor(
    private logger: SupportLoggerService,
    private storage: SupportStorageService
  ) {}
  
  ngOnInit() {
    this.logger.info('Component initialized');
    
    // Load saved data
    const savedEmail = this.storage.getLocal('email', '');
    if (savedEmail) {
      this.email = savedEmail;
    }
  }
  
  saveData() {
    this.storage.setLocal('email', this.email);
    this.logger.info('Data saved', { email: this.email });
  }
  
  logInfo() {
    const emailValid = isEmail(this.email);
    const formatted = formatCurrency(this.amount, { currency: 'USD' });
    
    this.logger.info('Current state', {
      email: this.email,
      emailValid,
      amount: this.amount,
      formatted
    });
  }
}`;
    
    fs.writeFileSync(path.join(examplesDir, 'angular-example.ts'), angularExample);
  }
  
  log.success(`Example files created in ${examplesDir}/`);
}

function showUsageInstructions(frameworks) {
  log.success('Installation completed successfully!');
  
  console.log('\n📋 Usage Instructions:\n');
  
  console.log('Import core utilities (works everywhere):');
  console.log('import { formatDate, isEmail, debounce } from "support-js-framework/core";\n');
  
  if (frameworks.includes('react')) {
    console.log('Import React features:');
    console.log('import { useDebounce, LazyImage } from "support-js-framework/react";\n');
  }
  
  if (frameworks.includes('nextjs')) {
    console.log('Import Next.js features:');
    console.log('import { SSRStorage, generateMetaTags } from "support-js-framework/nextjs";\n');
  }
  
  if (frameworks.includes('angular')) {
    console.log('Import Angular features:');
    console.log('import { SupportLoggerService } from "support-js-framework/angular";\n');
  }
  
  console.log('📁 Check the support-js-examples/ folder for complete usage examples.');
  console.log('📖 Visit the docs/ folder for detailed documentation.');
}

function main() {
  const args = process.argv.slice(2);
  
  console.log('🚀 Support.js Framework Universal Installer\n');
  
  // Parse arguments
  let targetFrameworks = [];
  let forceInstall = false;
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: node install-all.js [options] [frameworks]

Options:
  --all             Install all framework dependencies
  --react           Install React dependencies only
  --nextjs          Install Next.js dependencies only  
  --angular         Install Angular dependencies only
  --force           Force installation even if frameworks are detected
  --help, -h        Show this help message

Examples:
  node install-all.js --all                 # Install all frameworks
  node install-all.js --react --nextjs      # Install React and Next.js only
  node install-all.js                       # Auto-detect and install
`);
    return;
  }
  
  if (args.includes('--force')) {
    forceInstall = true;
  }
  
  if (args.includes('--all')) {
    targetFrameworks = ['react', 'nextjs', 'angular'];
  } else {
    if (args.includes('--react')) targetFrameworks.push('react');
    if (args.includes('--nextjs')) targetFrameworks.push('nextjs');
    if (args.includes('--angular')) targetFrameworks.push('angular');
  }
  
  // Auto-detect if no specific frameworks requested
  if (targetFrameworks.length === 0) {
    log.step('Auto-detecting existing frameworks...');
    const detected = detectExistingFrameworks();
    
    if (detected.length > 0) {
      log.info(`Detected frameworks: ${detected.join(', ')}`);
      targetFrameworks = detected;
    } else {
      log.info('No frameworks detected, installing all dependencies');
      targetFrameworks = ['react', 'nextjs', 'angular'];
    }
  }
  
  // Detect package manager
  const packageManager = detectPackageManager();
  log.info(`Detected package manager: ${packageManager}`);
  
  // Prepare packages to install
  const packages = ['support-js-framework'];
  const allDeps = new Set();
  
  targetFrameworks.forEach(framework => {
    if (FRAMEWORK_DEPENDENCIES[framework]) {
      FRAMEWORK_DEPENDENCIES[framework].forEach(dep => allDeps.add(dep));
    }
  });
  
  packages.push(...Array.from(allDeps));
  
  log.info(`Installing Support.js Framework with: ${targetFrameworks.join(', ')}`);
  
  // Install packages
  const success = installPackages(packages, packageManager);
  
  if (success) {
    createExampleFiles(targetFrameworks);
    showUsageInstructions(targetFrameworks);
  } else {
    log.error('Installation failed. Please check the error messages above.');
    process.exit(1);
  }
}

// Run installer
if (require.main === module) {
  main();
}

module.exports = { main, FRAMEWORK_DEPENDENCIES };