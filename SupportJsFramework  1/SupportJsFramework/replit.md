# Support.js Framework

## Overview

Support.js Framework is a comprehensive JavaScript utility library providing framework-agnostic core utilities with optional integrations for React, Next.js, and Angular. The project is designed as a modern TypeScript library with tree-shaking support, SSR compatibility, and comprehensive testing coverage.

## System Architecture

### Core Architecture
The framework follows a modular architecture with three main layers:

1. **Core Utilities Layer**: Framework-agnostic utilities for date, string, array, object, validation, number, browser, storage, performance, color, and logging operations
2. **Framework Integration Layer**: Optional framework-specific integrations providing hooks, components, services, and pipes
3. **Build & Distribution Layer**: TypeScript compilation, bundling, and distribution in both ESM and CommonJS formats

### Technology Stack
- **Language**: TypeScript with strict type checking
- **Build System**: Rollup with TypeScript plugin for optimized bundles
- **Testing**: Jest with ts-jest for TypeScript support and jsdom for browser environment simulation
- **Code Quality**: ESLint with TypeScript rules and Prettier for formatting
- **Package Management**: npm with peer dependencies for framework integrations

## Key Components

### Core Utilities
- **Date**: Formatting, manipulation, and validation utilities (`formatDate`, `addDays`, `isToday`)
- **String**: Text processing utilities (`capitalize`, `camelCase`, `kebabCase`, `truncate`)
- **Array**: Collection manipulation (`unique`, `groupBy`, `flatten`, `chunk`, `intersection`)
- **Object**: Deep operations (`deepClone`, `merge`, `pick`, `omit`, `deepEqual`)
- **Validation**: Input validation (`isEmail`, `isPhone`, `isURL`, `isCreditCard`)
- **Number**: Formatting and mathematical utilities (`formatCurrency`, `formatPercentage`, `roundTo`)
- **Browser**: Detection and feature checking (`getBrowserInfo`, device detection)
- **Storage**: Enhanced localStorage/sessionStorage with JSON serialization
- **Performance**: Optimization utilities (`debounce`, `throttle`, `memoize`)
- **Color**: Manipulation and conversion (`hexToRgb`, `lighten`, `darken`)
- **Logger**: Multi-level logging with storage and formatting options

### Framework Integrations

#### React Integration
- **Hooks**: `useDebounce`, `useThrottle`, `useLocalStorage`, `useWindowSize`, `useCopyToClipboard`
- **Components**: `LazyImage`, `ErrorBoundary`, `DateDisplay`, `CurrencyDisplay`
- **State Management**: Enhanced state hooks with persistence and async handling

#### Next.js Integration
- **SSR Storage**: Server-safe storage utilities that handle hydration
- **SEO Utilities**: Meta tag generation, structured data helpers
- **Image Optimization**: Utilities for Next.js image optimization
- **API Helpers**: Request/response utilities for API routes

#### Angular Integration
- **Services**: `SupportLoggerService`, `SupportStorageService`, `SupportBrowserService`
- **Pipes**: `SupportDatePipe`, `SupportCurrencyPipe`, `SupportStringPipe`
- **RxJS Integration**: Observable-based utilities with proper lifecycle management

## Data Flow

### Core Utilities Flow
1. Import specific utilities or entire modules
2. Tree-shaking eliminates unused code during bundling
3. TypeScript provides compile-time type safety
4. Runtime execution with browser/Node.js compatibility

### Framework Integration Flow
1. Framework-specific packages import core utilities
2. Additional framework features (hooks, services, components) are layered on top
3. Peer dependencies ensure compatibility with host framework versions
4. SSR-safe implementations handle server/client differences

### Storage Flow
1. Storage utilities provide unified API across localStorage, sessionStorage, and cookies
2. Automatic JSON serialization/deserialization
3. Error handling and fallbacks for unsupported environments
4. Type-safe operations with TypeScript generics

## External Dependencies

### Core Dependencies
- **TypeScript**: For type definitions and compilation
- **Rollup**: Build system with plugins for TypeScript, CommonJS, and terser
- **Jest**: Testing framework with ts-jest and jsdom

### Framework Peer Dependencies
- **React/React-DOM**: For React integration features
- **Next.js**: For Next.js-specific utilities
- **Angular Core/Common**: For Angular services and pipes
- **RxJS**: For Angular reactive programming utilities

### Development Dependencies
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **fs-extra**: Enhanced file system operations for build scripts
- **chalk**: Terminal color output for build scripts

## Deployment Strategy

### Build Process
1. **TypeScript Compilation**: Source code compiled with strict type checking
2. **Bundle Generation**: Separate ESM and CommonJS builds via Rollup
3. **Tree-shaking Optimization**: Unused code elimination for optimal bundle sizes
4. **Source Maps**: Generated for debugging support
5. **Type Definitions**: Declaration files generated for TypeScript consumers

### Distribution Strategy
- **NPM Package**: Single package with optional framework integrations
- **Multiple Entry Points**: Separate imports for core, React, Next.js, and Angular
- **Peer Dependencies**: Framework integrations require host framework as peer dependency
- **Version Compatibility**: Semantic versioning with clear breaking change documentation

### Testing Strategy
- **Unit Tests**: Comprehensive coverage for all core utilities
- **Integration Tests**: Framework-specific functionality testing
- **Browser Environment**: jsdom simulation for browser APIs
- **Mock Environment**: localStorage, sessionStorage, and other browser APIs mocked
- **Coverage Requirements**: 80% threshold for branches, functions, lines, and statements

## Changelog

```
Changelog:
- June 15, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```