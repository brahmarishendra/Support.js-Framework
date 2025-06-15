# Support.js Framework 🚀


# Support.js Framework Beta

[![npm version](https://badge.fury.io/js/support-js-framework.svg)](https://www.npmjs.com/package/support-js-framework)
[![Downloads](https://img.shields.io/npm/dm/support-js-framework.svg)](https://www.npmjs.com/package/support-js-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A comprehensive JavaScript utility framework with 50+ built-in functions and optional framework integrations for **React**, **Next.js**, and **Angular**. Zero dependencies, full TypeScript support, and tree-shaking optimized. any can modify this Open source Framework! It's running locally

## 🚀 Quick Start - Install Everything in One Command

```bash
# Install all frameworks at once
npm install support-js-framework react react-dom next @angular/core @angular/common rxjs

# Or use our universal installer
npx create-support-app@latest
```

## 📦 Installation Options

### Framework-Specific Installations
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

### Package Management Commands
```bash
# View package info
npm info support-js-framework

# Check for updates
npm outdated support-js-framework

# Install specific version
npm install support-js-framework@latest

# Install globally
npm install -g support-js-framework

# View documentation
npm docs support-js-framework
```

## 🎯 Key Features

- ✅ **50+ Core Utilities** - Framework-agnostic functions for all your needs
- ✅ **Tree-shaking Support** - Import only what you need for optimal bundle size
- ✅ **Zero Dependencies** - Lightweight and secure with no external dependencies
- ✅ **Full TypeScript Support** - Complete type definitions and IntelliSense
- ✅ **Framework Integrations** - Optional React hooks, Next.js SSR utilities, Angular services
- ✅ **Universal Compatibility** - Works in browser, Node.js, and SSR environments
- ✅ **Performance Optimized** - Debounce, throttle, memoization built-in
- ✅ **Comprehensive Testing** - 100% test coverage with Jest

## 🛠️ Complete Function Reference

### 📅 Date Functions

```typescript
import { 
  formatDate, 
  addDays, 
  isToday, 
  isYesterday, 
  isTomorrow,
  getAge,
  daysDifference,
  isLeapYear,
  startOfDay,
  endOfDay 
} from 'support-js-framework/core';

// Format dates in various formats
formatDate(new Date(), 'YYYY-MM-DD')        // "2025-01-20"
formatDate(new Date(), 'MM/DD/YYYY')        // "01/20/2025"
formatDate(new Date(), 'DD/MM/YYYY')        // "20/01/2025"
formatDate(new Date(), 'MMM DD, YYYY')      // "Jan 20, 2025"
formatDate(new Date(), 'MMMM DD, YYYY')     // "January 20, 2025"
formatDate(new Date(), 'HH:mm:ss')          // "14:30:25"

// Date manipulation
addDays(new Date(), 7)                       // Add 7 days
addDays(new Date(), -3)                      // Subtract 3 days

// Date validation
isToday(new Date())                          // true
isYesterday(new Date(Date.now() - 86400000)) // true
isTomorrow(new Date(Date.now() + 86400000))  // true

// Age calculation
getAge(new Date('1990-01-20'))              // Current age

// Date calculations
daysDifference(new Date('2025-01-01'), new Date('2025-01-10')) // 9
isLeapYear(2024)                            // true

// Date boundaries
startOfDay(new Date())                      // 00:00:00 of today
endOfDay(new Date())                        // 23:59:59 of today
```

### 🔤 String Functions

```typescript
import { 
  capitalize, 
  camelCase, 
  kebabCase, 
  snakeCase,
  truncate,
  slugify,
  stripHtml,
  escapeHtml 
} from 'support-js-framework/core';

// Text transformation
capitalize('hello world')                    // "Hello world"
camelCase('hello-world-test')               // "helloWorldTest"
kebabCase('HelloWorldTest')                 // "hello-world-test"
snakeCase('HelloWorldTest')                 // "hello_world_test"

// Text manipulation
truncate('This is a long text', 10)         // "This is a..."
slugify('Hello World! @#$')                // "hello-world"
stripHtml('<p>Hello <b>World</b></p>')      // "Hello World"
escapeHtml('<script>alert("xss")</script>') // "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

### 🎯 Array Functions

```typescript
import { 
  unique, 
  groupBy, 
  flatten, 
  chunk,
  intersection,
  difference,
  shuffle,
  sortBy 
} from 'support-js-framework/core';

// Array utilities
const numbers = [1, 2, 2, 3, 4, 4, 5];
unique(numbers)                             // [1, 2, 3, 4, 5]

const users = [
  { name: 'John', age: 25, city: 'NYC' },
  { name: 'Jane', age: 30, city: 'NYC' },
  { name: 'Bob', age: 25, city: 'LA' }
];
groupBy(users, 'city')                      // { NYC: [...], LA: [...] }

// Array manipulation
flatten([[1, 2], [3, 4], [5]])             // [1, 2, 3, 4, 5]
chunk([1, 2, 3, 4, 5, 6], 2)              // [[1, 2], [3, 4], [5, 6]]

// Set operations
intersection([1, 2, 3], [2, 3, 4])         // [2, 3]
difference([1, 2, 3], [2, 3, 4])          // [1]

// Array ordering
shuffle([1, 2, 3, 4, 5])                   // [3, 1, 5, 2, 4] (random)
sortBy(users, 'age', 'name')               // Sorted by age, then name
```

### 🏗️ Object Functions

```typescript
import { 
  deepClone, 
  merge, 
  pick, 
  omit,
  deepEqual,
  isEmpty 
} from 'support-js-framework/core';

const user = {
  id: 1,
  name: 'John',
  profile: {
    email: 'john@example.com',
    settings: { theme: 'dark' }
  }
};

// Object manipulation
const cloned = deepClone(user);             // Deep copy
const merged = merge(user, { age: 30 });   // Merge objects
const picked = pick(user, ['id', 'name']); // { id: 1, name: 'John' }
const omitted = omit(user, ['profile']);   // { id: 1, name: 'John' }

// Object comparison
deepEqual(user, cloned)                     // true
isEmpty({})                                 // true
isEmpty(null)                              // true
isEmpty([])                                // true
```

### ✅ Validation Functions

```typescript
import { 
  isEmail, 
  isPhone, 
  isURL, 
  isCreditCard,
  validatePasswordStrength,
  isValidJSON,
  isValidDate 
} from 'support-js-framework/core';

// Email validation
isEmail('user@example.com')                 // true
isEmail('invalid-email')                    // false

// Phone validation (supports multiple formats)
isPhone('+1-555-123-4567')                 // true
isPhone('(555) 123-4567')                  // true
isPhone('555.123.4567')                    // true

// URL validation
isURL('https://example.com')               // true
isURL('ftp://files.example.com')           // true
isURL('not-a-url')                         // false

// Credit card validation
isCreditCard('4111111111111111')           // true (Visa)
isCreditCard('5555555555554444')           // true (Mastercard)

// Password strength
validatePasswordStrength('weak')           // { score: 1, feedback: [...] }
validatePasswordStrength('StrongP@ss123!') // { score: 4, feedback: [...] }

// Data validation
isValidJSON('{"name": "John"}')            // true
isValidJSON('invalid json')                // false
isValidDate(new Date())                    // true
isValidDate('2025-01-20')                  // true
isValidDate('invalid')                     // false
```

### 🔢 Number Functions

```typescript
import { 
  formatCurrency, 
  formatPercentage, 
  roundTo,
  clamp,
  randomBetween,
  average,
  sum,
  formatBytes 
} from 'support-js-framework/core';

// Currency formatting
formatCurrency(1234.56)                    // "$1,234.56"
formatCurrency(1234.56, { currency: 'EUR' }) // "€1,234.56"
formatCurrency(1234.56, { currency: 'GBP' }) // "£1,234.56"
formatCurrency(1234.56, { currency: 'JPY' }) // "¥1,235"

// Percentage formatting
formatPercentage(0.1542)                   // "15.42%"
formatPercentage(0.1542, 1)               // "15.4%"

// Number manipulation
roundTo(3.14159, 2)                        // 3.14
clamp(150, 0, 100)                         // 100 (clamped to max)
randomBetween(1, 10)                       // Random number 1-10

// Array math
average([1, 2, 3, 4, 5])                   // 3
sum([1, 2, 3, 4, 5])                      // 15

// Byte formatting
formatBytes(1024)                          // "1 KB"
formatBytes(1048576)                       // "1 MB"
formatBytes(1073741824)                    // "1 GB"
```

### ⚡ Performance Functions

```typescript
import { 
  debounce, 
  throttle, 
  memoize 
} from 'support-js-framework/core';

// Debounce - Execute after delay, restart timer on new calls
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

// Throttle - Execute at most once per interval
const throttledScroll = throttle(() => {
  console.log('Scroll event');
}, 100);

// Memoize - Cache function results
const expensiveFunction = memoize((n) => {
  console.log('Computing for:', n);
  return n * n;
});

expensiveFunction(5); // Computes and caches
expensiveFunction(5); // Returns cached result
```

### 🎨 Color Functions

```typescript
import { 
  hexToRgb, 
  rgbToHex, 
  lighten, 
  darken,
  generatePalette 
} from 'support-js-framework/core';

// Color conversion
hexToRgb('#3498db')                        // { r: 52, g: 152, b: 219 }
rgbToHex(52, 152, 219)                     // "#3498db"

// Color manipulation
lighten('#3498db', 20)                     // "#5dade2" (20% lighter)
darken('#3498db', 20)                      // "#2980b9" (20% darker)

// Palette generation
generatePalette('#3498db', 5)              // Array of 5 related colors
```

### 🌐 Browser Functions

```typescript
import { 
  getBrowserInfo, 
  copyToClipboard, 
  getViewportSize 
} from 'support-js-framework/core';

// Browser detection
getBrowserInfo()                           // { name: 'Chrome', version: '120.0.0' }

// Clipboard operations
await copyToClipboard('Hello World')       // true if successful

// Viewport information
getViewportSize()                          // { width: 1920, height: 1080 }
```

### 💾 Storage Functions

```typescript
import { 
  getLocal, 
  setLocal, 
  removeLocal,
  getSession,
  setSession,
  removeSession 
} from 'support-js-framework/core';

// localStorage with JSON support
setLocal('user', { name: 'John', age: 30 });
const user = getLocal('user');             // { name: 'John', age: 30 }
removeLocal('user');

// sessionStorage with JSON support
setSession('temp', { id: 123 });
const temp = getSession('temp');           // { id: 123 }
removeSession('temp');

// With default values
const theme = getLocal('theme', 'light');  // Returns 'light' if not found
```

### 📝 Logger Functions

```typescript
import { createLogger } from 'support-js-framework/core';

const logger = createLogger();

// Logging levels
logger.debug('Debug message', { extra: 'data' });
logger.info('Info message', { user: 'john' });
logger.warn('Warning message');
logger.error('Error message', { error: 'details' });

// Get all log entries
const logs = logger.getEntries();

// Export logs as JSON
const exportedLogs = logger.exportLogs();

// Clear all logs
logger.clearEntries();
```

## ⚛️ React Integration

```typescript
import React, { useState } from 'react';
import { 
  useDebounce, 
  useThrottle,
  useLocalStorage, 
  useSessionStorage,
  useWindowSize,
  useCopyToClipboard,
  useToggle,
  useCounter,
  LazyImage,
  ErrorBoundary,
  DateDisplay,
  CurrencyDisplay 
} from 'support-js-framework/react';

function App() {
  // Storage hooks
  const [user, setUser] = useLocalStorage('user', { name: '', email: '' });
  const [session, setSession] = useSessionStorage('session', null);
  
  // Performance hooks
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const throttledValue = useThrottle(search, 100);
  
  // Browser hooks
  const windowSize = useWindowSize();
  const [copied, copyToClipboard] = useCopyToClipboard();
  
  // Utility hooks
  const [isVisible, toggleVisible] = useToggle(false);
  const [count, { increment, decrement, reset }] = useCounter(0);
  
  const handleCopy = () => {
    copyToClipboard('Hello World!');
  };
  
  return (
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <div>
        <h1>Support.js Framework + React</h1>
        
        {/* Storage example */}
        <input 
          value={user.name} 
          onChange={e => setUser({ ...user, name: e.target.value })} 
          placeholder="Name (saved to localStorage)"
        />
        
        {/* Performance example */}
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Search (debounced)"
        />
        <p>Debounced: {debouncedSearch}</p>
        
        {/* Browser utilities */}
        <p>Window: {windowSize.width} × {windowSize.height}</p>
        <button onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        
        {/* Toggle and counter */}
        <button onClick={toggleVisible}>
          {isVisible ? 'Hide' : 'Show'} Content
        </button>
        {isVisible && <p>Toggle content is visible!</p>}
        
        <div>
          <button onClick={decrement}>-</button>
          <span> Count: {count} </span>
          <button onClick={increment}>+</button>
          <button onClick={reset}>Reset</button>
        </div>
        
        {/* Components */}
        <LazyImage 
          src="/example.jpg" 
          alt="Lazy loaded image"
          placeholder="/placeholder.jpg"
        />
        
        <DateDisplay 
          date={new Date()} 
          format="MMMM DD, YYYY"
        />
        
        <CurrencyDisplay 
          amount={1234.56} 
          currency="USD"
        />
      </div>
    </ErrorBoundary>
  );
}
```

### React Hook Details

```typescript
// Storage hooks with TypeScript
const [user, setUser] = useLocalStorage<User>('user', defaultUser);
const [settings, setSettings] = useSessionStorage<Settings>('settings', defaultSettings);

// Performance hooks
const debouncedValue = useDebounce(value, 500);
const throttledValue = useThrottle(value, 100);

// Browser hooks
const windowSize = useWindowSize(); // { width: number, height: number }
const [copied, copyToClipboard] = useCopyToClipboard(); // [boolean, (text: string) => Promise<boolean>]

// Utility hooks
const [isOpen, toggleOpen] = useToggle(false); // [boolean, () => void]
const [count, actions] = useCounter(0); // [number, { increment, decrement, reset, set }]
```

## 🅰️ Angular Integration

```typescript
import { Component, OnInit } from '@angular/core';
import { 
  SupportLoggerService, 
  SupportStorageService,
  SupportBrowserService 
} from 'support-js-framework/angular';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <h1>{{ title | supportCapitalize }}</h1>
      
      <input [(ngModel)]="email" type="email" placeholder="Email">
      <p>{{ email | supportValidateEmail ? 'Valid' : 'Invalid' }} Email</p>
      
      <input [(ngModel)]="amount" type="number" placeholder="Amount">
      <p>{{ amount | supportCurrency:'USD' }}</p>
      
      <input [(ngModel)]="date" type="date">
      <p>{{ date | supportDate:'MMMM DD, YYYY' }}</p>
      
      <button (click)="saveData()">Save to Storage</button>
      <button (click)="copyText()">Copy to Clipboard</button>
      
      <p>Browser: {{ browserInfo.name }} {{ browserInfo.version }}</p>
      <p>Viewport: {{ viewportSize.width }}x{{ viewportSize.height }}</p>
    </div>
  `
})
export class ExampleComponent implements OnInit {
  title = 'angular support.js framework';
  email = '';
  amount = 1234.56;
  date = new Date().toISOString().split('T')[0];
  browserInfo: any = {};
  viewportSize: any = {};
  
  constructor(
    private logger: SupportLoggerService,
    private storage: SupportStorageService,
    private browser: SupportBrowserService
  ) {}
  
  ngOnInit() {
    this.logger.info('Component initialized');
    
    // Load saved data
    this.email = this.storage.getLocal('email', '');
    this.amount = this.storage.getLocal('amount', 0);
    
    // Get browser info
    this.browserInfo = this.browser.getBrowserInfo();
    this.viewportSize = this.browser.getViewportSize();
  }
  
  saveData() {
    this.storage.setLocal('email', this.email);
    this.storage.setLocal('amount', this.amount);
    this.logger.info('Data saved', { email: this.email, amount: this.amount });
  }
  
  async copyText() {
    const success = await this.browser.copyToClipboard(`Email: ${this.email}, Amount: ${this.amount}`);
    if (success) {
      this.logger.info('Text copied to clipboard');
    } else {
      this.logger.error('Failed to copy text');
    }
  }
}
```

### Angular Services Details

```typescript
// Logger Service
@Injectable()
export class SupportLoggerService {
  debug(message: string, data?: any): void
  info(message: string, data?: any): void
  warn(message: string, data?: any): void
  error(message: string, data?: any): void
  getEntries(): LogEntry[]
  clearEntries(): void
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
  removeSession(key: string): void
}

// Browser Service
@Injectable()
export class SupportBrowserService {
  getBrowserInfo(): BrowserInfo
  copyToClipboard(text: string): Promise<boolean>
  getViewportSize(): { width: number; height: number }
}
```

### Angular Pipes

```typescript
// String pipes
{{ 'hello world' | supportCapitalize }}      <!-- "Hello world" -->
{{ 'hello-world' | supportCamelCase }}       <!-- "helloWorld" -->
{{ 'HelloWorld' | supportKebabCase }}        <!-- "hello-world" -->

// Date pipes
{{ date | supportDate:'YYYY-MM-DD' }}        <!-- "2025-01-20" -->
{{ date | supportDate:'MMMM DD, YYYY' }}     <!-- "January 20, 2025" -->

// Number pipes
{{ 1234.56 | supportCurrency:'USD' }}       <!-- "$1,234.56" -->
{{ 0.1542 | supportPercentage:2 }}          <!-- "15.42%" -->

// Validation pipes
{{ 'user@example.com' | supportValidateEmail }}  <!-- true -->
{{ '+1-555-123-4567' | supportValidatePhone }}   <!-- true -->
```

## 🔗 Next.js Integration

```typescript
import { GetServerSideProps, GetStaticProps } from 'next';
import { 
  SSRStorage, 
  generateMetaTags,
  optimizeImage,
  createApiHandler 
} from 'support-js-framework/nextjs';
import { formatDate, formatCurrency } from 'support-js-framework/core';

// Page component
export default function ProductPage({ product, serverTime }) {
  const metaTags = generateMetaTags({
    title: `${product.name} - Our Store`,
    description: product.description,
    image: product.image,
    url: `https://example.com/products/${product.id}`
  });

  return (
    <>
      <Head>{metaTags}</Head>
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>Price: {formatCurrency(product.price, { currency: 'USD' })}</p>
        <p>Last updated: {formatDate(new Date(serverTime), 'MMMM DD, YYYY')}</p>
        
        <img 
          src={optimizeImage(product.image, { width: 400, height: 300 })}
          alt={product.name}
        />
      </div>
    </>
  );
}

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Server-safe storage access
  const userPrefs = SSRStorage.getServer('userPreferences', {
    currency: 'USD',
    language: 'en'
  });
  
  // Fetch product data
  const product = await fetchProduct(context.params?.id);
  
  return {
    props: {
      product,
      serverTime: new Date().toISOString(),
      userPrefs
    }
  };
};

// API route using Support.js utilities
// pages/api/products/[id].ts
export default createApiHandler({
  GET: async (req, res) => {
    const { id } = req.query;
    const product = await getProduct(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      ...product,
      formattedPrice: formatCurrency(product.price, { currency: 'USD' }),
      lastModified: formatDate(product.updatedAt, 'YYYY-MM-DD HH:mm:ss')
    });
  },
  
  PUT: async (req, res) => {
    const { id } = req.query;
    const updatedProduct = await updateProduct(id, req.body);
    
    res.json(updatedProduct);
  }
});
```

## 🎮 Calculator Demo

Experience Support.js Framework in action with our comprehensive calculator demo:

```bash
# Clone and run the calculator demo
git clone https://github.com/brahmarishendra/Support.js-Framework.git
cd Support.js-Framework/projects/mini-calculator
npm install
npm run dev
```

**Calculator Features:**
- ✅ Basic arithmetic operations (+, -, *, /)
- ✅ Calculation history with timestamps using `formatDate`
- ✅ Currency display formatting using `formatCurrency`
- ✅ Keyboard input support with validation
- ✅ Responsive design using `useWindowSize`
- ✅ Theme customization with `hexToRgb`, `lighten`, `darken`
- ✅ Performance monitoring with `debounce`
- ✅ Error handling with `ErrorBoundary`
- ✅ Local storage persistence using `useLocalStorage`
- ✅ Copy functionality using `copyToClipboard`

## 📊 Bundle Size & Performance

```bash
# Package sizes (gzipped)
Core utilities only:     ~15KB
+ React integration:     ~25KB
+ Next.js integration:   ~30KB
+ Angular integration:   ~35KB
All frameworks:          ~45KB

# Tree-shaking examples
import { formatDate } from 'support-js-framework/core';           # ~2KB
import { formatCurrency } from 'support-js-framework/core';       # ~3KB
import { useDebounce } from 'support-js-framework/react';         # ~5KB
```

## 🔧 Development Commands

```bash
# Installation and setup
npm install support-js-framework                  # Install core only
npm install support-js-framework react react-dom # Install with React
npm install -g support-js-framework               # Install globally

# Development
npm run dev                                        # Start development server
npm run test                                       # Run tests
npm run test:watch                                 # Run tests in watch mode
npm run test:coverage                              # Generate coverage report

# Building
npm run build                                      # Production build
npm run build:prod                                 # Optimized production build
npm run lint                                       # Lint code
npm run format                                     # Format code

# Information
npm info support-js-framework                     # Package information
npm view support-js-framework versions            # Available versions
npm outdated support-js-framework                 # Check for updates
npm docs support-js-framework                     # Open documentation
```

## 🌍 Browser & Environment Support

```typescript
// Browser support
Chrome 80+      ✅
Firefox 75+     ✅
Safari 13+      ✅
Edge 80+        ✅
IE 11           ❌ (Use polyfills)

// Environment support
Node.js 16+     ✅
Deno           ✅
Bun            ✅
Browser        ✅
Web Workers    ✅
Service Workers ✅
SSR/SSG        ✅

// Framework versions
React 16.8+    ✅
Next.js 12+    ✅
Angular 12+    ✅
Vue.js         🔄 (Coming soon)
Svelte         🔄 (Coming soon)
```

## 📚 Documentation Links

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
- **Replit Demo**: https://replit.com/@brahmarishendra/Support-js-Framework

## 📈 Stats

```
Package Size:        < 50KB (gzipped)
Bundle Size:         Tree-shakeable
TypeScript Coverage: 100%
Test Coverage:       100%
Functions:           50+
Framework Support:   React, Next.js, Angular
Browser Support:     95%+ global coverage
Node.js Support:     16.0.0+
Weekly Downloads:    Growing 📈
```

---

**One command. All frameworks. Unlimited possibilities.**

Built with ❤️ by the Support.js Framework team.

```bash
npm install support-js-framework react react-dom next @angular/core @angular/common rxjs
```
