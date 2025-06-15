# Core Utilities Documentation

Support.js Framework provides a comprehensive set of framework-agnostic utilities that work in any JavaScript/TypeScript environment.

## Table of Contents

- [Date Utilities](#date-utilities)
- [String Utilities](#string-utilities)
- [Array Utilities](#array-utilities)
- [Object Utilities](#object-utilities)
- [Validation Utilities](#validation-utilities)
- [Number Utilities](#number-utilities)
- [Browser Utilities](#browser-utilities)
- [Storage Utilities](#storage-utilities)
- [Performance Utilities](#performance-utilities)
- [Color Utilities](#color-utilities)
- [Logger Utilities](#logger-utilities)

## Date Utilities

### Basic Usage

```typescript
import { formatDate, addDays, isToday } from 'support-js-framework/core/date';

const date = new Date('2023-06-15');
console.log(formatDate(date, 'YYYY-MM-DD')); // "2023-06-15"
console.log(addDays(date, 7)); // Date object 7 days later
console.log(isToday(new Date())); // true
