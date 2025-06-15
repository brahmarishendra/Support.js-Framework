# Support.js Framework 🚀

[![npm version](https://badge.fury.io/js/support-js-framework.svg)](https://www.npmjs.com/package/support-js-framework)
[![Downloads](https://img.shields.io/npm/dm/support-js-framework.svg)](https://www.npmjs.com/package/support-js-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A comprehensive JavaScript utility framework with 50+ built-in functions and optional framework integrations for **React**, **Next.js**, and **Angular**. Zero dependencies, full TypeScript support, and tree-shaking optimized.

## 🚀 Quick Start - Install Everything in One Command

### All Frameworks (React + Next.js + Angular)
```bash
npm install support-js-framework react react-dom next @angular/core @angular/common rxjs
```

### Alternative: Use Our Universal Installer
```bash
npx support-js-framework --all
```

## 📦 Installation Options

### All frameworks in one command
```bash
npm install support-js-framework react react-dom next @angular/core @angular/common rxjs
```

### Framework-specific installations
```bash
# Core + React only
npm install support-js-framework react react-dom

# Core + Next.js only
npm install support-js-framework react react-dom next

# Core + Angular only
npm install support-js-framework @angular/core @angular/common rxjs

# Core utilities only (framework-agnostic)
npm install support-js-framework
```

## 🎯 Key Features

- **50+ Core Utilities** - Framework-agnostic functions for date, string, array, object operations
- **Tree-shaking Support** - Import only what you need for optimal bundle size
- **Zero Dependencies** - Lightweight and secure with no external dependencies
- **Full TypeScript Support** - Complete type definitions and IntelliSense
- **Framework Integrations** - Optional React hooks, Next.js SSR utilities, Angular services
- **Universal Compatibility** - Works in browser, Node.js, and SSR environments
- **Performance Optimized** - Debounce, throttle, memoization built-in
- **Comprehensive Testing** - 100% test coverage with Jest

## 🛠️ NPM Package Commands

### Installation Commands
```bash
# Install with npm
npm install support-js-framework

# Install with yarn
yarn add support-js-framework

# Install with pnpm
pnpm add support-js-framework

# Install globally
npm install -g support-js-framework

# Install specific version
npm install support-js-framework@latest

# Install with peer dependencies (React)
npm install support-js-framework react react-dom

# Install with peer dependencies (Angular)
npm install support-js-framework @angular/core @angular/common rxjs

# Install development version
npm install support-js-framework@dev
```

### Package Information Commands
```bash
# View package info
npm info support-js-framework

# View package versions
npm view support-js-framework versions --json

# Check for updates
npm outdated support-js-framework

# View package dependencies
npm list support-js-framework

# View package documentation
npm docs support-js-framework

# View package repository
npm repo support-js-framework
```

### Development Commands
```bash
# Clone and setup for development
git clone https://github.com/brahmarishendra/Support.js-Framework.git
cd Support.js-Framework
npm install

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Build the project
npm run build
npm run build:prod

# Lint and format
npm run lint
npm run lint:fix
npm run format

# Type check
npm run type-check

# Run examples
npm run dev
npm run start

# Clean build artifacts
npm run clean
```

## 💻 Universal Usage Examples

### Core Utilities (Works Everywhere)
```javascript
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
console.log(today); // "2025-06-15"

// Email validation
const isValid = isEmail('user@example.com');
console.log(isValid); // true

// Currency formatting
const price = formatCurrency(1234.56, { currency: 'USD' });
console.log(price); // "$1,234.56"

// Color manipulation
const rgb = hexToRgb('#3498db');
console.log(rgb); // { r: 52, g: 152, b: 219 }

// Performance optimization
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

// Array utilities
const numbers = [1, 2, 2, 3, 4, 4, 5];
const uniqueNumbers = unique(numbers);
console.log(uniqueNumbers); // [1, 2, 3, 4, 5]

// Object utilities
const original = { user: { name: 'John', age: 30 } };
const cloned = deepClone(original);
```

### React Integration
```jsx
import React, { useState } from 'react';
import { 
  useDebounce, 
  useLocalStorage, 
  useWindowSize,
  LazyImage 
} from 'support-js-framework/react';
import { formatCurrency, isEmail } from 'support-js-framework/core';

function App() {
  const [search, setSearch] = useLocalStorage('search', '');
  const [email, setEmail] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const windowSize = useWindowSize();
  
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
        <p>Window size: {windowSize.width} × {windowSize.height}</p>
        <LazyImage src="/example.jpg" alt="Lazy loaded image" />
      </div>
    </div>
  );
}
```

### Next.js Integration
```typescript
import { GetServerSideProps } from 'next';
import { SSRStorage, generateMetaTags } from 'support-js-framework/nextjs';
import { formatDate } from 'support-js-framework/core';

export default function Page({ serverData, timestamp }) {
  return (
    <div>
      <h1>Next.js with Support.js Framework</h1>
      <p>Server data: {serverData}</p>
      <p>Generated: {formatDate(new Date(timestamp), 'YYYY-MM-DD HH:mm:ss')}</p>
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
};
```

### Angular Integration
```typescript
import { Component, OnInit } from '@angular/core';
import { 
  SupportLoggerService, 
  SupportStorageService 
} from 'support-js-framework/angular';
import { formatCurrency, isEmail } from 'support-js-framework/core';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <h1>{{ title | supportCapitalize }}</h1>
      
      <div>
        <label>Email:</label>
        <input [(ngModel)]="email" type="email">
        <p>{{ isEmailValid() ? 'Valid' : 'Invalid' }}</p>
      </div>
      
      <div>
        <label>Amount:</label>
        <input [(ngModel)]="amount" type="number">
        <p>{{ amount | supportCurrency:'USD' }}</p>
      </div>
      
      <button (click)="saveData()">Save to Storage</button>
    </div>
  `
})
export class ExampleComponent implements OnInit {
  title = 'angular support.js framework';
  amount = 1234.56;
  email = '';
  
  constructor(
    private logger: SupportLoggerService,
    private storage: SupportStorageService
  ) {}
  
  ngOnInit() {
    this.logger.info('Component initialized');
    this.email = this.storage.getLocal('email', '');
  }
  
  isEmailValid(): boolean {
    return isEmail(this.email);
  }
  
  saveData() {
    this.storage.setLocal('email', this.email);
    this.logger.info('Data saved', { email: this.email });
  }
}
```

## 🎮 Calculator Demo

### Mini Calculator Project
Experience Support.js Framework in action with our comprehensive calculator demo built across all frameworks:

```bash
# Clone and run the calculator demo
git clone https://github.com/brahmarishendra/Support.js-Framework.git
cd Support.js-Framework/projects/mini-calculator
npm install
npm run dev
```

**Calculator Features:**
- Basic arithmetic operations (+, -, *, /)
- Calculation history with timestamps
- Currency display formatting
- Keyboard input support
- Responsive design for mobile/desktop
- Theme customization
- Performance monitoring
- Error handling and validation
- Local storage persistence
- Export functionality

**Framework Utilities Demonstrated:**
- **Core**: `formatCurrency`, `roundTo`, `debounce`, `memoize`, `createLogger`
- **React**: `useLocalStorage`, `useDebounce`, `useWindowSize`, `ErrorBoundary`
- **Next.js**: `SSRStorage`, `generateMetaTags`, server-side rendering
- **Angular**: `SupportLoggerService`, `SupportStorageService`, custom pipes

## 🏗️ Core Utilities Reference

### Date Functions
```typescript
formatDate(date: Date, format: DateFormat): string
addDays(date: Date, days: number): Date
isToday(date: Date): boolean
isYesterday(date: Date): boolean
isTomorrow(date: Date): boolean
getAge(birthDate: Date): number
daysDifference(date1: Date, date2: Date): number
isLeapYear(year: number): boolean
startOfDay(date: Date): Date
endOfDay(date: Date): Date
```

### String Functions
```typescript
capitalize(str: string): string
camelCase(str: string): string
kebabCase(str: string): string
snakeCase(str: string): string
truncate(str: string, length: number): string
slugify(str: string): string
stripHtml(str: string): string
escapeHtml(str: string): string
```

### Array Functions
```typescript
unique<T>(array: T[]): T[]
groupBy<T>(array: T[], key: keyof T): Record<string, T[]>
flatten<T>(array: (T | T[])[]): T[]
chunk<T>(array: T[], size: number): T[][]
intersection<T>(arr1: T[], arr2: T[]): T[]
difference<T>(arr1: T[], arr2: T[]): T[]
shuffle<T>(array: T[]): T[]
sortBy<T>(array: T[], ...criteria: Function[]): T[]
```

### Object Functions
```typescript
deepClone<T>(obj: T): T
merge<T>(target: T, ...sources: Partial<T>[]): T
pick<T>(obj: T, keys: (keyof T)[]): Partial<T>
omit<T>(obj: T, keys: (keyof T)[]): Partial<T>
deepEqual(obj1: any, obj2: any): boolean
isEmpty(obj: any): boolean
```

### Validation Functions
```typescript
isEmail(email: string): boolean
isPhone(phone: string): boolean
isURL(url: string): boolean
isCreditCard(number: string): boolean
validatePasswordStrength(password: string): PasswordStrength
isValidJSON(str: string): boolean
isValidDate(date: any): boolean
```

### Number Functions
```typescript
formatCurrency(amount: number, options?: CurrencyOptions): string
formatPercentage(value: number, decimals?: number): string
roundTo(number: number, decimals: number): number
clamp(value: number, min: number, max: number): number
randomBetween(min: number, max: number): number
average(numbers: number[]): number
sum(numbers: number[]): number
formatBytes(bytes: number, decimals?: number): string
```

### Performance Functions
```typescript
debounce<T extends Function>(func: T, delay: number): T
throttle<T extends Function>(func: T, delay: number): T
memoize<T extends Function>(func: T): T
```

### Color Functions
```typescript
hexToRgb(hex: string): RGB | null
rgbToHex(r: number, g: number, b: number): string
lighten(color: string, percentage: number): string
darken(color: string, percentage: number): string
generatePalette(baseColor: string, count?: number): string[]
```

## 🎯 React Hooks

```typescript
// Storage hooks
useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]
useSessionStorage<T>(key: string, initialValue: T): [T, (value: T) => void]

// Performance hooks
useDebounce<T>(value: T, delay: number): T
useThrottle<T>(value: T, delay: number): T

// Browser hooks
useWindowSize(): { width: number; height: number }
useCopyToClipboard(): [boolean, (text: string) => Promise<boolean>]

// Utility hooks
useToggle(initialValue?: boolean): [boolean, () => void]
useCounter(initialValue?: number): [number, CounterActions]
```

## 🅰️ Angular Services

```typescript
// Logger Service
@Injectable()
export class SupportLoggerService {
  info(message: string, data?: any): void
  debug(message: string, data?: any): void
  warn(message: string, data?: any): void
  error(message: string, data?: any): void
  exportLogs(): string
}

// Storage Service
@Injectable()
export class SupportStorageService {
  getLocal<T>(key: string, defaultValue?: T): T
  setLocal<T>(key: string, value: T): void
  removeLocal(key: string): void
  getSession<T>(key: string, defaultValue?: T): T
  setSession<T>(key: string, value: T): void
}

// Browser Service
@Injectable()
export class SupportBrowserService {
  getBrowserInfo(): BrowserInfo
  copyToClipboard(text: string): Promise<boolean>
  getViewportSize(): { width: number; height: number }
}
```

## 🔧 Build and Development

### Project Structure
```
Support.js-Framework/
├── src/
│   ├── core/               # Core utilities
│   ├── integrations/       # Framework integrations
│   │   ├── react/          # React hooks & components
│   │   ├── nextjs/         # Next.js SSR utilities
│   │   └── angular/        # Angular services & pipes
│   └── types/              # TypeScript definitions
├── tests/                  # Comprehensive test suite
├── docs/                   # Documentation
├── examples/               # Usage examples
├── projects/
│   └── mini-calculator/    # Calculator demo
├── build/                  # Build scripts
└── dist/                   # Built packages
```

### Build Commands
```bash
# Development
npm run dev              # Start development server
npm run test:watch       # Run tests in watch mode
npm run lint:fix         # Fix linting issues

# Production
npm run build:prod       # Production build
npm run test:coverage    # Generate coverage report
npm run validate         # Validate build output

# Publishing
npm run prepare          # Pre-publish hooks
npm run release          # Create release
npm publish              # Publish to npm
```

## 📚 Documentation

- **[Installation Guide](docs/installation.md)** - Complete setup instructions
- **[Core Utilities](docs/core-utilities.md)** - Detailed API reference
- **[React Integration](docs/react-integration.md)** - Hooks and components guide
- **[Next.js Integration](docs/nextjs-integration.md)** - SSR and performance features
- **[Angular Integration](docs/angular-integration.md)** - Services and pipes guide
- **[Calculator Demo](projects/mini-calculator/)** - Live example project
- **[Migration Guide](docs/migration-guide.md)** - Upgrade instructions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure tests pass: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **NPM Package**: https://www.npmjs.com/package/support-js-framework
- **GitHub Repository**: https://github.com/brahmarishendra/Support.js-Framework
- **Documentation Website**: https://brahmarishendra.github.io/Support.js-Framework
- **Calculator Demo**: https://brahmarishendra.github.io/Support.js-Framework/calculator

## 📊 Stats

- **Package Size**: < 50KB (gzipped)
- **Bundle Size**: Tree-shakeable (import only what you use)
- **TypeScript Coverage**: 100%
- **Test Coverage**: 100%
- **Browser Support**: ES2018+ (95%+ global support)
- **Node.js Support**: 16.0.0+

---

**One command. All frameworks. Unlimited possibilities.**

Built with ❤️ by the Support.js Framework team.
