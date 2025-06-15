# Quick Start Guide - Support.js Framework

## Single Command Installation for All Frameworks

Install Support.js Framework with all framework dependencies in one command:

### For React + Next.js + Angular Projects
```bash
npm install support-js-framework react react-dom next @angular/core @angular/common rxjs
```

### Alternative Installation Commands

#### Core + React Only
```bash
npm install support-js-framework react react-dom
```

#### Core + Next.js Only  
```bash
npm install support-js-framework react react-dom next
```

#### Core + Angular Only
```bash
npm install support-js-framework @angular/core @angular/common rxjs
```

#### Core Only (Framework-agnostic)
```bash
npm install support-js-framework
```

## Quick Usage Examples

### Import Everything at Once
```typescript
// Core utilities
import { formatDate, isEmail, hexToRgb, debounce } from 'support-js-framework/core';

// React hooks and components
import { useDebounce, useLocalStorage, LazyImage } from 'support-js-framework/react';

// Next.js utilities
import { SSRStorage, generateMetaTags } from 'support-js-framework/nextjs';

// Angular services and pipes
import { SupportLoggerService } from 'support-js-framework/angular';
```

### Universal Usage Across All Frameworks

#### Core Utilities (Works everywhere)
```typescript
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

// Email validation
const isValid = isEmail('user@example.com');

// Currency formatting
const price = formatCurrency(1234.56, { currency: 'USD' });

// Color manipulation
const rgb = hexToRgb('#3498db');

// Performance optimization
const debouncedSearch = debounce((query) => search(query), 300);
```

#### React Integration
```typescript
import React from 'react';
import { useDebounce, useLocalStorage, LazyImage } from 'support-js-framework/react';

function App() {
  const [search, setSearch] = useLocalStorage('search', '');
  const debouncedSearch = useDebounce(search, 300);
  
  return (
    <div>
      <input 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
      />
      <LazyImage src="/image.jpg" alt="Example" />
    </div>
  );
}
```

#### Next.js Integration
```typescript
import { GetServerSideProps } from 'next';
import { SSRStorage, generateMetaTags } from 'support-js-framework/nextjs';

export default function Page({ data }) {
  return (
    <div>
      <h1>Next.js with Support.js Framework</h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = SSRStorage.getServer('key', 'default');
  return { props: { data } };
};
```

#### Angular Integration
```typescript
import { Component } from '@angular/core';
import { SupportLoggerService } from 'support-js-framework/angular';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{ title | supportCapitalize }}</h1>
    <p>{{ amount | supportCurrency:'USD' }}</p>
  `
})
export class AppComponent {
  title = 'angular app';
  amount = 1234.56;
  
  constructor(private logger: SupportLoggerService) {
    this.logger.info('App initialized');
  }
}
```

## Framework Setup Instructions

### React Project Setup
```json
{
  "dependencies": {
    "support-js-framework": "^1.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

### Next.js Project Setup
```json
{
  "dependencies": {
    "support-js-framework": "^1.0.0", 
    "next": "^13.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

### Angular Project Setup
```json
{
  "dependencies": {
    "support-js-framework": "^1.0.0",
    "@angular/core": "^16.0.0",
    "@angular/common": "^16.0.0", 
    "rxjs": "^7.0.0"
  }
}
```

### Multi-Framework Project (All in One)
```json
{
  "dependencies": {
    "support-js-framework": "^1.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0", 
    "next": "^13.0.0",
    "@angular/core": "^16.0.0",
    "@angular/common": "^16.0.0",
    "rxjs": "^7.0.0"
  }
}
```

## Key Features Available Across All Frameworks

### Core Utilities (Framework-agnostic)
- **Date**: `formatDate`, `addDays`, `isToday`, `daysDifference`
- **String**: `capitalize`, `camelCase`, `kebabCase`, `truncate`
- **Array**: `unique`, `groupBy`, `flatten`, `chunk`, `intersection`
- **Object**: `deepClone`, `merge`, `pick`, `omit`, `deepEqual`
- **Validation**: `isEmail`, `isPhone`, `isURL`, `isCreditCard`
- **Number**: `formatCurrency`, `formatPercentage`, `roundTo`
- **Browser**: `getBrowserInfo`, `copyToClipboard`, `getViewportSize`
- **Storage**: Enhanced localStorage/sessionStorage with JSON support
- **Performance**: `debounce`, `throttle`, `memoize`
- **Color**: `hexToRgb`, `lighten`, `darken`, `generatePalette`
- **Logger**: Multi-level logging with storage options

### Framework-Specific Features

#### React Features
- **Hooks**: `useDebounce`, `useThrottle`, `useLocalStorage`, `useWindowSize`
- **Components**: `LazyImage`, `ErrorBoundary`, `DateDisplay`, `CurrencyDisplay`

#### Next.js Features  
- **SSR Storage**: Server-safe storage utilities
- **SEO**: `generateMetaTags`, structured data helpers
- **Image**: Optimization utilities for Next.js images
- **API**: Request/response helpers for API routes

#### Angular Features
- **Services**: `SupportLoggerService`, `SupportStorageService`, `SupportBrowserService`
- **Pipes**: `SupportDatePipe`, `SupportCurrencyPipe`, `SupportStringPipe`
- **RxJS**: Observable-based utilities with lifecycle management

## Tree-Shaking Support

The framework supports tree-shaking, so you only bundle what you use:

```typescript
// Only imports the specific functions you need
import { formatDate, isEmail } from 'support-js-framework/core';
```

This ensures optimal bundle sizes regardless of which frameworks you have installed.