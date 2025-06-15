/**
 * React Calculator Component using Support.js Framework
 * Demonstrates React hooks, components, and core utilities integration
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  useLocalStorage, 
  useDebounce, 
  useWindowSize,
  ErrorBoundary 
} from 'support-js-framework/react';
import { 
  formatDate, 
  formatCurrency,
  hexToRgb,
  lighten,
  darken 
} from 'support-js-framework/core';
import { Calculator, CalculatorOperation, CalculatorHistoryEntry } from '../core/calculator';

// Calculator button interface
interface CalculatorButton {
  label: string;
  value: string | CalculatorOperation;
  type: 'number' | 'operation' | 'function';
  className?: string;
}

// Calculator button configuration
const CALCULATOR_BUTTONS: CalculatorButton[] = [
  { label: 'C', value: 'clear', type: 'function', className: 'clear' },
  { label: '⌫', value: 'backspace', type: 'function', className: 'backspace' },
  { label: '±', value: 'toggle-sign', type: 'function', className: 'toggle' },
  { label: '÷', value: '/', type: 'operation', className: 'operation' },
  
  { label: '7', value: '7', type: 'number' },
  { label: '8', value: '8', type: 'number' },
  { label: '9', value: '9', type: 'number' },
  { label: '×', value: '*', type: 'operation', className: 'operation' },
  
  { label: '4', value: '4', type: 'number' },
  { label: '5', value: '5', type: 'number' },
  { label: '6', value: '6', type: 'number' },
  { label: '−', value: '-', type: 'operation', className: 'operation' },
  
  { label: '1', value: '1', type: 'number' },
  { label: '2', value: '2', type: 'number' },
  { label: '3', value: '3', type: 'number' },
  { label: '+', value: '+', type: 'operation', className: 'operation' },
  
  { label: '0', value: '0', type: 'number', className: 'zero' },
  { label: '.', value: '.', type: 'function' },
  { label: '=', value: '=', type: 'operation', className: 'equals' },
];

// Theme configuration
interface CalculatorTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  buttonBg: string;
  operationBg: string;
}

const DEFAULT_THEME: CalculatorTheme = {
  primary: '#3498db',
  secondary: '#2ecc71',
  background: '#ecf0f1',
  text: '#2c3e50',
  buttonBg: '#ffffff',
  operationBg: '#e74c3c'
};

/**
 * History Panel Component
 */
const HistoryPanel: React.FC<{
  history: CalculatorHistoryEntry[];
  onClearHistory: () => void;
  isVisible: boolean;
}> = ({ history, onClearHistory, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>Calculation History</h3>
        <button onClick={onClearHistory} className="clear-history-btn">
          Clear All
        </button>
      </div>
      <div className="history-list">
        {history.length === 0 ? (
          <p className="no-history">No calculations yet</p>
        ) : (
          history.map((entry, index) => (
            <div key={index} className="history-item">
              <div className="history-expression">{entry.expression}</div>
              <div className="history-result">= {entry.result}</div>
              <div className="history-time">
                {formatDate(entry.timestamp, 'HH:mm:ss')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/**
 * Settings Panel Component
 */
const SettingsPanel: React.FC<{
  theme: CalculatorTheme;
  onThemeChange: (theme: CalculatorTheme) => void;
  isVisible: boolean;
  onClose: () => void;
}> = ({ theme, onThemeChange, isVisible, onClose }) => {
  const [tempTheme, setTempTheme] = useState(theme);

  const handleColorChange = (key: keyof CalculatorTheme, color: string) => {
    setTempTheme(prev => ({ ...prev, [key]: color }));
  };

  const handleApply = () => {
    onThemeChange(tempTheme);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h3>Calculator Settings</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="settings-content">
          <div className="color-section">
            <h4>Theme Colors</h4>
            
            <div className="color-input">
              <label>Primary Color:</label>
              <input
                type="color"
                value={tempTheme.primary}
                onChange={e => handleColorChange('primary', e.target.value)}
              />
              <span>{tempTheme.primary}</span>
            </div>
            
            <div className="color-input">
              <label>Secondary Color:</label>
              <input
                type="color"
                value={tempTheme.secondary}
                onChange={e => handleColorChange('secondary', e.target.value)}
              />
              <span>{tempTheme.secondary}</span>
            </div>
            
            <div className="color-input">
              <label>Background:</label>
              <input
                type="color"
                value={tempTheme.background}
                onChange={e => handleColorChange('background', e.target.value)}
              />
              <span>{tempTheme.background}</span>
            </div>
          </div>
          
          <div className="preview-section">
            <h4>Preview</h4>
            <div 
              className="color-preview"
              style={{
                background: `linear-gradient(135deg, ${tempTheme.primary}, ${tempTheme.secondary})`,
                color: tempTheme.text
              }}
            >
              Sample Calculator Display
            </div>
          </div>
          
          <div className="settings-actions">
            <button onClick={onClose} className="cancel-btn">Cancel</button>
            <button onClick={handleApply} className="apply-btn">Apply Theme</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main React Calculator Component
 */
export const ReactCalculator: React.FC = () => {
  // Calculator instance and display state
  const [calculator] = useState(() => new Calculator());
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<CalculatorHistoryEntry[]>([]);
  
  // UI state
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  
  // Theme and settings
  const [theme, setTheme] = useLocalStorage<CalculatorTheme>('calc-theme', DEFAULT_THEME);
  const [currency, setCurrency] = useLocalStorage('calc-currency', 'USD');
  
  // Performance optimizations
  const windowSize = useWindowSize();
  const debouncedDisplay = useDebounce(display, 100);
  
  // Update display when calculator state changes
  const updateDisplay = useCallback(() => {
    setDisplay(calculator.getDisplay());
    setHistory(calculator.getHistory());
  }, [calculator]);

  // Handle button clicks
  const handleButtonClick = useCallback((button: CalculatorButton) => {
    const { value, type } = button;
    
    switch (type) {
      case 'number':
        calculator.inputDigit(value as string);
        break;
        
      case 'operation':
        if (value === '=') {
          calculator.performOperation('=');
        } else {
          calculator.performOperation(value as CalculatorOperation);
        }
        break;
        
      case 'function':
        if (value === 'clear') {
          calculator.clear();
        } else if (value === 'backspace') {
          calculator.backspace();
        } else if (value === '.') {
          calculator.inputDot();
        } else if (value === 'toggle-sign') {
          const currentDisplay = calculator.getDisplay();
          if (currentDisplay !== '0' && currentDisplay !== 'Error') {
            const newValue = currentDisplay.startsWith('-') 
              ? currentDisplay.slice(1) 
              : '-' + currentDisplay;
            calculator.clear();
            calculator.inputDigit(newValue);
          }
        }
        break;
    }
    
    updateDisplay();
  }, [calculator, updateDisplay]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      
      // Find matching button
      const button = CALCULATOR_BUTTONS.find(btn => {
        if (btn.value === key) return true;
        if (key === 'Enter' && btn.value === '=') return true;
        if (key === 'Escape' && btn.value === 'clear') return true;
        if (key === 'Backspace' && btn.value === 'backspace') return true;
        return false;
      });
      
      if (button) {
        event.preventDefault();
        handleButtonClick(button);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleButtonClick]);

  // Theme application
  const themeVars = {
    '--primary-color': theme.primary,
    '--secondary-color': theme.secondary,
    '--background-color': theme.background,
    '--text-color': theme.text,
    '--button-bg': theme.buttonBg,
    '--operation-bg': theme.operationBg,
    '--primary-light': lighten(theme.primary, 20),
    '--primary-dark': darken(theme.primary, 20),
  } as React.CSSProperties;

  // Calculate responsive classes
  const isMobile = windowSize.width < 768;
  const calculatorClass = `react-calculator ${isMobile ? 'mobile' : 'desktop'}`;

  return (
    <ErrorBoundary fallback={<div>Calculator error occurred</div>}>
      <div className={calculatorClass} style={themeVars}>
        {/* Header */}
        <div className="calculator-header">
          <h2>React Calculator</h2>
          <div className="header-actions">
            <button 
              onClick={() => setShowCurrency(!showCurrency)}
              className={`toggle-btn ${showCurrency ? 'active' : ''}`}
              title="Toggle currency display"
            >
              $
            </button>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`toggle-btn ${showHistory ? 'active' : ''}`}
              title="Show/hide history"
            >
              📊
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="settings-btn"
              title="Calculator settings"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="calculator-display">
          <div className="display-value">
            {showCurrency ? calculator.getDisplayAsCurrency(currency) : debouncedDisplay}
          </div>
          <div className="display-info">
            {showCurrency && (
              <select 
                value={currency} 
                onChange={e => setCurrency(e.target.value)}
                className="currency-selector"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="calculator-content">
          {/* Button Grid */}
          <div className="calculator-grid">
            {CALCULATOR_BUTTONS.map((button, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(button)}
                className={`calc-button ${button.type} ${button.className || ''}`}
                title={`${button.label} (${button.value})`}
              >
                {button.label}
              </button>
            ))}
          </div>

          {/* History Panel */}
          <HistoryPanel
            history={history}
            onClearHistory={() => {
              calculator.clearHistory();
              updateDisplay();
            }}
            isVisible={showHistory}
          />
        </div>

        {/* Info Panel */}
        <div className="calculator-info">
          <div className="info-item">
            <span>Screen Size:</span>
            <span>{windowSize.width} × {windowSize.height}</span>
          </div>
          <div className="info-item">
            <span>Calculations:</span>
            <span>{history.length}</span>
          </div>
          <div className="info-item">
            <span>Theme:</span>
            <div 
              className="theme-preview" 
              style={{ backgroundColor: theme.primary }}
              title={`Primary: ${theme.primary}`}
            />
          </div>
        </div>

        {/* Settings Panel */}
        <SettingsPanel
          theme={theme}
          onThemeChange={setTheme}
          isVisible={showSettings}
          onClose={() => setShowSettings(false)}
        />

        {/* Calculator Styles */}
        <style jsx>{`
          .react-calculator {
            max-width: 400px;
            margin: 0 auto;
            background: var(--background-color);
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .calculator-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .calculator-header h2 {
            margin: 0;
            color: var(--text-color);
            font-size: 1.5rem;
          }

          .header-actions {
            display: flex;
            gap: 8px;
          }

          .toggle-btn, .settings-btn {
            background: var(--button-bg);
            border: 2px solid var(--primary-color);
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
          }

          .toggle-btn:hover, .settings-btn:hover {
            background: var(--primary-light);
          }

          .toggle-btn.active {
            background: var(--primary-color);
            color: white;
          }

          .calculator-display {
            background: var(--button-bg);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            text-align: right;
            border: 2px solid var(--primary-color);
          }

          .display-value {
            font-size: 2.5rem;
            font-weight: 300;
            color: var(--text-color);
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            word-break: break-all;
          }

          .display-info {
            margin-top: 10px;
            display: flex;
            justify-content: flex-end;
          }

          .currency-selector {
            background: var(--background-color);
            border: 1px solid var(--primary-color);
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
          }

          .calculator-content {
            display: flex;
            gap: 20px;
          }

          .calculator-grid {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
          }

          .calc-button {
            background: var(--button-bg);
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
            border-color: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .calc-button:active {
            transform: translateY(0);
          }

          .calc-button.operation {
            background: var(--operation-bg);
            color: white;
          }

          .calc-button.function {
            background: var(--primary-color);
            color: white;
          }

          .calc-button.zero {
            grid-column: span 2;
          }

          .calc-button.equals {
            background: var(--secondary-color);
            color: white;
          }

          .history-panel {
            width: 250px;
            background: var(--button-bg);
            border-radius: 12px;
            border: 2px solid var(--primary-color);
            overflow: hidden;
          }

          .history-header {
            background: var(--primary-color);
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

          .clear-history-btn {
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
            padding: 8px;
            border-bottom: 1px solid var(--background-color);
            font-size: 14px;
          }

          .history-expression {
            color: var(--text-color);
            opacity: 0.7;
          }

          .history-result {
            font-weight: 600;
            color: var(--primary-color);
          }

          .history-time {
            font-size: 12px;
            color: var(--text-color);
            opacity: 0.5;
          }

          .no-history {
            text-align: center;
            color: var(--text-color);
            opacity: 0.5;
            padding: 20px;
          }

          .calculator-info {
            margin-top: 20px;
            padding: 15px;
            background: var(--button-bg);
            border-radius: 8px;
            border: 1px solid var(--primary-color);
            display: flex;
            justify-content: space-between;
            font-size: 14px;
          }

          .info-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .theme-preview {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 1px solid var(--text-color);
          }

          .settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .settings-panel {
            background: var(--background-color);
            border-radius: 16px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow: hidden;
          }

          .settings-header {
            background: var(--primary-color);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .close-btn {
            background: transparent;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .settings-content {
            padding: 20px;
          }

          .color-section h4 {
            margin: 0 0 15px 0;
            color: var(--text-color);
          }

          .color-input {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
          }

          .color-input label {
            flex: 1;
            color: var(--text-color);
          }

          .color-input input[type="color"] {
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }

          .color-input span {
            font-family: monospace;
            font-size: 12px;
            color: var(--text-color);
            opacity: 0.7;
          }

          .preview-section {
            margin: 20px 0;
          }

          .color-preview {
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
          }

          .settings-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
          }

          .cancel-btn, .apply-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
          }

          .cancel-btn {
            background: var(--background-color);
            color: var(--text-color);
            border: 2px solid var(--primary-color);
          }

          .apply-btn {
            background: var(--primary-color);
            color: white;
          }

          /* Mobile responsiveness */
          .react-calculator.mobile {
            max-width: 100%;
            padding: 15px;
          }

          .react-calculator.mobile .calculator-content {
            flex-direction: column;
          }

          .react-calculator.mobile .history-panel {
            width: 100%;
            order: -1;
          }

          .react-calculator.mobile .calc-button {
            padding: 15px;
            font-size: 1.1rem;
          }

          .react-calculator.mobile .display-value {
            font-size: 2rem;
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
};