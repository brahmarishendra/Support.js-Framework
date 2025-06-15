/**
 * Angular Calculator Component using Support.js Framework
 * Demonstrates Angular services, pipes, and RxJS integration
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject, BehaviorSubject, interval } from 'rxjs';
import { takeUntil, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import {
  SupportLoggerService,
  SupportStorageService,
  SupportBrowserService,
  SupportPerformanceService
} from 'support-js-framework/angular';

import {
  formatDate,
  formatCurrency,
  hexToRgb,
  lighten,
  darken,
  roundTo
} from 'support-js-framework/core';

import { Calculator, CalculatorHistoryEntry, CalculatorOperation } from '../core/calculator';

// Angular calculator state interface
interface AngularCalculatorState {
  display: string;
  history: CalculatorHistoryEntry[];
  currentTheme: string;
  settings: {
    soundEnabled: boolean;
    animationsEnabled: boolean;
    currency: string;
    decimalPlaces: number;
  };
}

// Calculator button configuration for Angular
interface AngularCalculatorButton {
  label: string;
  value: string | CalculatorOperation;
  type: 'number' | 'operation' | 'function';
  className: string;
  shortcut?: string;
}

@Component({
  selector: 'app-angular-calculator',
  template: `
    <div class="angular-calculator" [style]="themeStyles">
      <!-- Header -->
      <div class="calculator-header">
        <h2>{{ 'Angular Calculator' | supportCapitalize }}</h2>
        <div class="header-controls">
          <button 
            (click)="toggleSettings()"
            class="control-btn"
            [class.active]="showSettings"
            title="Settings">
            ⚙️
          </button>
          <button 
            (click)="toggleHistory()"
            class="control-btn"
            [class.active]="showHistory"
            title="History">
            📊
          </button>
          <button 
            (click)="exportCalculations()"
            class="control-btn"
            title="Export">
            📤
          </button>
        </div>
      </div>

      <!-- Display -->
      <div class="calculator-display">
        <div class="display-main">
          {{ currentDisplay | supportCurrency:state.settings.currency }}
        </div>
        <div class="display-info">
          <span>{{ getCurrentTime() | supportDate:'HH:mm:ss' }}</span>
          <span>{{ getCalculationCount() }} calculations</span>
        </div>
      </div>

      <!-- Settings Panel -->
      <div class="settings-panel" *ngIf="showSettings" [@slideDown]>
        <h3>Calculator Settings</h3>
        
        <div class="setting-group">
          <label>Theme Color:</label>
          <input 
            type="color" 
            [(ngModel)]="selectedTheme"
            (change)="updateTheme($event)"
            class="color-picker">
          <span>{{ selectedTheme }}</span>
        </div>
        
        <div class="setting-group">
          <label>Currency:</label>
          <select 
            [(ngModel)]="state.settings.currency"
            (change)="saveSetting('currency', $event)"
            class="setting-select">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
        
        <div class="setting-group">
          <label>Decimal Places:</label>
          <input 
            type="range" 
            min="0" 
            max="8" 
            [(ngModel)]="state.settings.decimalPlaces"
            (change)="saveSetting('decimalPlaces', $event)"
            class="setting-range">
          <span>{{ state.settings.decimalPlaces }}</span>
        </div>
        
        <div class="setting-group">
          <label>
            <input 
              type="checkbox" 
              [(ngModel)]="state.settings.soundEnabled"
              (change)="saveSetting('soundEnabled', $event)">
            Sound Effects
          </label>
        </div>
        
        <div class="setting-group">
          <label>
            <input 
              type="checkbox" 
              [(ngModel)]="state.settings.animationsEnabled"
              (change)="saveSetting('animationsEnabled', $event)">
            Animations
          </label>
        </div>
      </div>

      <!-- Calculator Grid -->
      <div class="calculator-grid">
        <button 
          *ngFor="let button of calculatorButtons; trackBy: trackButton"
          (click)="handleButtonClick(button)"
          [class]="'calc-button ' + button.type + ' ' + button.className"
          [title]="getButtonTitle(button)"
          [@buttonPress]="getButtonAnimation(button)">
          {{ button.label }}
        </button>
      </div>

      <!-- History Panel -->
      <div class="history-panel" *ngIf="showHistory" [@slideUp]>
        <div class="history-header">
          <h3>Calculation History</h3>
          <div class="history-controls">
            <button (click)="clearHistory()" class="clear-btn">Clear</button>
            <button (click)="exportHistory()" class="export-btn">Export</button>
          </div>
        </div>
        
        <div class="history-list" #historyContainer>
          <div 
            *ngFor="let entry of state.history; let i = index; trackBy: trackHistoryEntry"
            class="history-item"
            [class.recent]="i < 3"
            (click)="selectHistoryEntry(entry)">
            
            <div class="history-expression">{{ entry.expression }}</div>
            <div class="history-result">
              = {{ entry.result | supportCurrency:state.settings.currency }}
            </div>
            <div class="history-time">
              {{ entry.timestamp | supportTimeAgo }}
            </div>
          </div>
          
          <div *ngIf="state.history.length === 0" class="no-history">
            No calculations yet. Start calculating!
          </div>
        </div>
      </div>

      <!-- Performance Monitor -->
      <div class="performance-monitor" *ngIf="showPerformanceInfo">
        <h4>Performance Monitor</h4>
        <div class="perf-metrics">
          <div class="metric">
            <span>Render Time:</span>
            <span>{{ renderTime }}ms</span>
          </div>
          <div class="metric">
            <span>Memory Usage:</span>
            <span>{{ getMemoryUsage() }}</span>
          </div>
          <div class="metric">
            <span>Browser:</span>
            <span>{{ browserInfo.name }} {{ browserInfo.version }}</span>
          </div>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="status-bar">
        <span class="status-item">
          {{ browserInfo.isMobile ? 'Mobile' : 'Desktop' }} Device
        </span>
        <span class="status-item">
          Last calculation: {{ getLastCalculationTime() | supportTimeAgo }}
        </span>
        <span class="status-item">
          Theme: {{ selectedTheme }}
        </span>
      </div>
    </div>
  `,
  animations: [
    // Custom animations for enhanced UX
  ],
  styles: [`
    .angular-calculator {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transition: all 0.3s ease;
    }

    .calculator-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid var(--primary-color, #3498db);
    }

    .calculator-header h2 {
      margin: 0;
      color: var(--text-color, #2c3e50);
      font-size: 1.5rem;
    }

    .header-controls {
      display: flex;
      gap: 8px;
    }

    .control-btn {
      background: var(--button-bg, #ffffff);
      border: 2px solid var(--primary-color, #3498db);
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .control-btn:hover {
      background: var(--primary-color, #3498db);
      color: white;
    }

    .control-btn.active {
      background: var(--primary-color, #3498db);
      color: white;
    }

    .calculator-display {
      background: var(--display-bg, #f8f9fa);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      border: 2px solid var(--primary-color, #3498db);
      text-align: right;
    }

    .display-main {
      font-size: 2.5rem;
      font-weight: 300;
      color: var(--text-color, #2c3e50);
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      word-break: break-all;
    }

    .display-info {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: var(--text-color-muted, #7f8c8d);
    }

    .settings-panel {
      background: var(--panel-bg, #ffffff);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      border: 2px solid var(--primary-color, #3498db);
    }

    .settings-panel h3 {
      margin: 0 0 20px 0;
      color: var(--text-color, #2c3e50);
    }

    .setting-group {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }

    .setting-group label {
      flex: 1;
      color: var(--text-color, #2c3e50);
    }

    .color-picker {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .setting-select, .setting-range {
      flex: 1;
      padding: 8px;
      border: 1px solid var(--border-color, #ddd);
      border-radius: 4px;
    }

    .calculator-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }

    .calc-button {
      background: var(--button-bg, #ffffff);
      border: 2px solid transparent;
      border-radius: 12px;
      padding: 20px;
      font-size: 1.2rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .calc-button:hover {
      border-color: var(--primary-color, #3498db);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .calc-button.operation {
      background: var(--operation-bg, #e74c3c);
      color: white;
    }

    .calc-button.function {
      background: var(--primary-color, #3498db);
      color: white;
    }

    .calc-button.zero {
      grid-column: span 2;
    }

    .calc-button.equals {
      background: var(--success-color, #2ecc71);
      color: white;
    }

    .history-panel {
      background: var(--panel-bg, #ffffff);
      border-radius: 12px;
      border: 2px solid var(--primary-color, #3498db);
      overflow: hidden;
      margin-bottom: 20px;
    }

    .history-header {
      background: var(--primary-color, #3498db);
      color: white;
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .history-header h3 {
      margin: 0;
      font-size: 1rem;
    }

    .history-controls {
      display: flex;
      gap: 8px;
    }

    .clear-btn, .export-btn {
      background: transparent;
      border: 1px solid white;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }

    .history-list {
      max-height: 300px;
      overflow-y: auto;
      padding: 10px;
    }

    .history-item {
      padding: 12px;
      border-bottom: 1px solid var(--border-color, #eee);
      cursor: pointer;
      transition: background 0.2s;
    }

    .history-item:hover {
      background: var(--hover-bg, #f8f9fa);
    }

    .history-item.recent {
      border-left: 4px solid var(--success-color, #2ecc71);
    }

    .history-expression {
      color: var(--text-color-muted, #7f8c8d);
      font-size: 0.9rem;
    }

    .history-result {
      font-weight: 600;
      color: var(--primary-color, #3498db);
      font-size: 1.1rem;
    }

    .history-time {
      font-size: 0.8rem;
      color: var(--text-color-muted, #7f8c8d);
      margin-top: 4px;
    }

    .no-history {
      text-align: center;
      color: var(--text-color-muted, #7f8c8d);
      padding: 30px;
      font-style: italic;
    }

    .performance-monitor {
      background: var(--panel-bg, #ffffff);
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
      border: 1px solid var(--border-color, #ddd);
    }

    .performance-monitor h4 {
      margin: 0 0 10px 0;
      color: var(--text-color, #2c3e50);
      font-size: 1rem;
    }

    .perf-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
    }

    .metric {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }

    .status-bar {
      background: var(--status-bg, #f8f9fa);
      border-radius: 8px;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: var(--text-color-muted, #7f8c8d);
      flex-wrap: wrap;
      gap: 10px;
    }

    .status-item {
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      .angular-calculator {
        padding: 15px;
      }

      .calculator-grid {
        gap: 8px;
      }

      .calc-button {
        padding: 15px;
        font-size: 1.1rem;
      }

      .display-main {
        font-size: 2rem;
      }

      .perf-metrics {
        grid-template-columns: 1fr;
      }

      .status-bar {
        flex-direction: column;
        gap: 5px;
      }
    }
  `]
})
export class AngularCalculatorComponent implements OnInit, OnDestroy {
  // Component state
  state: AngularCalculatorState = {
    display: '0',
    history: [],
    currentTheme: '#3498db',
    settings: {
      soundEnabled: true,
      animationsEnabled: true,
      currency: 'USD',
      decimalPlaces: 2
    }
  };

  // UI state
  showSettings = false;
  showHistory = false;
  showPerformanceInfo = false;
  selectedTheme = '#3498db';
  currentDisplay = '0';
  renderTime = 0;

  // Calculator instance
  private calculator: Calculator;
  private destroy$ = new Subject<void>();
  private renderStart = performance.now();

  // Observables
  currentTime$ = interval(1000).pipe(
    map(() => new Date()),
    takeUntil(this.destroy$)
  );

  // Browser info
  browserInfo: any = {};

  // Calculator buttons configuration
  calculatorButtons: AngularCalculatorButton[] = [
    { label: 'C', value: 'clear', type: 'function', className: 'clear', shortcut: 'Escape' },
    { label: '⌫', value: 'backspace', type: 'function', className: 'backspace', shortcut: 'Backspace' },
    { label: '±', value: 'toggle-sign', type: 'function', className: 'toggle' },
    { label: '÷', value: '/', type: 'operation', className: 'operation', shortcut: '/' },
    
    { label: '7', value: '7', type: 'number', className: '', shortcut: '7' },
    { label: '8', value: '8', type: 'number', className: '', shortcut: '8' },
    { label: '9', value: '9', type: 'number', className: '', shortcut: '9' },
    { label: '×', value: '*', type: 'operation', className: 'operation', shortcut: '*' },
    
    { label: '4', value: '4', type: 'number', className: '', shortcut: '4' },
    { label: '5', value: '5', type: 'number', className: '', shortcut: '5' },
    { label: '6', value: '6', type: 'number', className: '', shortcut: '6' },
    { label: '−', value: '-', type: 'operation', className: 'operation', shortcut: '-' },
    
    { label: '1', value: '1', type: 'number', className: '', shortcut: '1' },
    { label: '2', value: '2', type: 'number', className: '', shortcut: '2' },
    { label: '3', value: '3', type: 'number', className: '', shortcut: '3' },
    { label: '+', value: '+', type: 'operation', className: 'operation', shortcut: '+' },
    
    { label: '0', value: '0', type: 'number', className: 'zero', shortcut: '0' },
    { label: '.', value: '.', type: 'function', className: '', shortcut: '.' },
    { label: '=', value: '=', type: 'operation', className: 'equals', shortcut: 'Enter' },
  ];

  constructor(
    private logger: SupportLoggerService,
    private storage: SupportStorageService,
    private browser: SupportBrowserService,
    private performance: SupportPerformanceService
  ) {
    this.calculator = new Calculator({
      enableHistory: true,
      enableLogging: true,
      decimalPlaces: this.state.settings.decimalPlaces
    });
  }

  ngOnInit(): void {
    this.renderTime = Math.round(performance.now() - this.renderStart);
    
    this.logger.info('Angular Calculator initialized');
    
    // Get browser information
    this.browserInfo = this.browser.getBrowserInfo();
    
    // Load saved settings
    this.loadSettings();
    
    // Load calculation history
    this.loadHistory();
    
    // Update display
    this.updateDisplay();
    
    // Setup keyboard listeners
    this.setupKeyboardHandlers();
    
    // Setup performance monitoring
    this.setupPerformanceMonitoring();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.logger.info('Angular Calculator destroyed');
  }

  /**
   * Handle button clicks
   */
  handleButtonClick(button: AngularCalculatorButton): void {
    this.logger.debug('Button clicked', { button: button.label, value: button.value });
    
    if (this.state.settings.soundEnabled) {
      this.playButtonSound();
    }
    
    const { value, type } = button;
    
    switch (type) {
      case 'number':
        this.calculator.inputDigit(value as string);
        break;
        
      case 'operation':
        if (value === '=') {
          this.calculator.performOperation('=');
        } else {
          this.calculator.performOperation(value as CalculatorOperation);
        }
        break;
        
      case 'function':
        this.handleFunctionButton(value as string);
        break;
    }
    
    this.updateDisplay();
    this.saveHistory();
  }

  /**
   * Handle function button actions
   */
  private handleFunctionButton(value: string): void {
    switch (value) {
      case 'clear':
        this.calculator.clear();
        break;
      case 'backspace':
        this.calculator.backspace();
        break;
      case '.':
        this.calculator.inputDot();
        break;
      case 'toggle-sign':
        this.toggleSign();
        break;
    }
  }

  /**
   * Toggle sign of current display
   */
  private toggleSign(): void {
    const currentDisplay = this.calculator.getDisplay();
    if (currentDisplay !== '0' && currentDisplay !== 'Error') {
      // Implementation for sign toggle
      this.logger.debug('Toggle sign', { currentDisplay });
    }
  }

  /**
   * Update display and state
   */
  private updateDisplay(): void {
    this.currentDisplay = this.calculator.getDisplay();
    this.state.display = this.currentDisplay;
    this.state.history = this.calculator.getHistory();
  }

  /**
   * Toggle settings panel
   */
  toggleSettings(): void {
    this.showSettings = !this.showSettings;
    if (this.showHistory && this.showSettings) {
      this.showHistory = false;
    }
  }

  /**
   * Toggle history panel
   */
  toggleHistory(): void {
    this.showHistory = !this.showHistory;
    if (this.showSettings && this.showHistory) {
      this.showSettings = false;
    }
  }

  /**
   * Update theme
   */
  updateTheme(event: any): void {
    this.selectedTheme = event.target.value;
    this.state.currentTheme = this.selectedTheme;
    this.saveSetting('theme', this.selectedTheme);
    this.applyTheme();
  }

  /**
   * Apply theme styles
   */
  private applyTheme(): void {
    const rgb = hexToRgb(this.selectedTheme);
    if (rgb) {
      const lighterColor = lighten(this.selectedTheme, 20);
      const darkerColor = darken(this.selectedTheme, 20);
      
      this.logger.debug('Theme applied', { 
        primary: this.selectedTheme,
        lighter: lighterColor,
        darker: darkerColor
      });
    }
  }

  /**
   * Get theme styles for component
   */
  get themeStyles(): string {
    return `
      --primary-color: ${this.selectedTheme};
      --primary-light: ${lighten(this.selectedTheme, 20)};
      --primary-dark: ${darken(this.selectedTheme, 20)};
      --text-color: #2c3e50;
      --button-bg: #ffffff;
      --panel-bg: #ffffff;
      --display-bg: #f8f9fa;
      --operation-bg: #e74c3c;
      --success-color: #2ecc71;
      --border-color: #dee2e6;
      --hover-bg: #f8f9fa;
      --status-bg: #f8f9fa;
      --text-color-muted: #7f8c8d;
    `;
  }

  /**
   * Save setting to storage
   */
  saveSetting(key: string, value: any): void {
    (this.state.settings as any)[key] = value;
    this.storage.setLocal('calculator-settings', this.state.settings);
    this.logger.debug('Setting saved', { key, value });
  }

  /**
   * Load settings from storage
   */
  private loadSettings(): void {
    const savedSettings = this.storage.getLocal('calculator-settings', {});
    this.state.settings = { ...this.state.settings, ...savedSettings };
    this.selectedTheme = savedSettings.theme || '#3498db';
    this.applyTheme();
  }

  /**
   * Load calculation history
   */
  private loadHistory(): void {
    const savedHistory = this.storage.getLocal('calculator-history', []);
    // Restore history to calculator
    savedHistory.forEach((entry: CalculatorHistoryEntry) => {
      // Note: In a real implementation, you'd restore the calculator state
    });
  }

  /**
   * Save calculation history
   */
  private saveHistory(): void {
    this.storage.setLocal('calculator-history', this.state.history);
  }

  /**
   * Clear calculation history
   */
  clearHistory(): void {
    this.calculator.clearHistory();
    this.updateDisplay();
    this.saveHistory();
    this.logger.info('History cleared');
  }

  /**
   * Export calculations
   */
  exportCalculations(): void {
    const data = {
      calculations: this.state.history,
      settings: this.state.settings,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator-export-${formatDate(new Date(), 'YYYY-MM-DD')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    this.logger.info('Calculations exported');
  }

  /**
   * Export history as formatted text
   */
  exportHistory(): void {
    const historyText = this.state.history
      .map(entry => `${entry.expression} = ${entry.result} (${formatDate(entry.timestamp, 'YYYY-MM-DD HH:mm:ss')})`)
      .join('\n');
    
    const blob = new Blob([historyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator-history-${formatDate(new Date(), 'YYYY-MM-DD')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Select history entry
   */
  selectHistoryEntry(entry: CalculatorHistoryEntry): void {
    // Load the result into calculator display
    this.calculator.clear();
    entry.result.toString().split('').forEach(digit => {
      if (digit === '.') {
        this.calculator.inputDot();
      } else if (/[0-9]/.test(digit)) {
        this.calculator.inputDigit(digit);
      }
    });
    this.updateDisplay();
  }

  /**
   * Setup keyboard event handlers
   */
  private setupKeyboardHandlers(): void {
    // Implementation would add keyboard event listeners
    this.logger.debug('Keyboard handlers setup');
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    this.performance.startMonitoring('angular-calculator');
    this.logger.debug('Performance monitoring started');
  }

  /**
   * Play button sound effect
   */
  private playButtonSound(): void {
    // Implementation would play sound
    this.logger.debug('Button sound played');
  }

  /**
   * Get current time
   */
  getCurrentTime(): Date {
    return new Date();
  }

  /**
   * Get calculation count
   */
  getCalculationCount(): number {
    return this.state.history.length;
  }

  /**
   * Get last calculation time
   */
  getLastCalculationTime(): Date | null {
    return this.state.history.length > 0 ? this.state.history[0].timestamp : null;
  }

  /**
   * Get memory usage info
   */
  getMemoryUsage(): string {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const used = Math.round(memory.usedJSHeapSize / 1048576);
      const total = Math.round(memory.totalJSHeapSize / 1048576);
      return `${used}/${total} MB`;
    }
    return 'N/A';
  }

  /**
   * Get button title for tooltip
   */
  getButtonTitle(button: AngularCalculatorButton): string {
    return button.shortcut ? `${button.label} (${button.shortcut})` : button.label;
  }

  /**
   * Get button animation state
   */
  getButtonAnimation(button: AngularCalculatorButton): string {
    return this.state.settings.animationsEnabled ? 'enabled' : 'disabled';
  }

  /**
   * Track function for buttons
   */
  trackButton(index: number, button: AngularCalculatorButton): string {
    return button.value.toString();
  }

  /**
   * Track function for history entries
   */
  trackHistoryEntry(index: number, entry: CalculatorHistoryEntry): string {
    return `${entry.expression}-${entry.timestamp.getTime()}`;
  }
}