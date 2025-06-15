import React, { useState, useEffect } from 'react';
import {
  useLocalStorage,
  useDebounce,
  useToggle,
  useCounter,
  useAsync,
  useWindowSize,
  useCopyToClipboard,
  useThrottledCallback,
  ErrorBoundary,
  LazyImage,
  DateDisplay,
  CurrencyDisplay,
  DebounceInput,
  If,
  Show,
  For
} from 'support-js-framework/react';

import {
  formatDate,
  addDays,
  capitalize,
  camelCase,
  formatCurrency,
  isEmail,
  isPhone,
  hexToRgb,
  lighten,
  darken,
  createLogger
} from 'support-js-framework/core';

// Initialize logger
const logger = createLogger({
  prefix: 'React-Demo',
  level: 'debug',
  enableConsole: true
});

// Types
interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
}

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Sample data
const sampleUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://via.placeholder.com/64/6366f1/ffffff?text=JD',
    createdAt: new Date('2023-01-15')
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://via.placeholder.com/64/8b5cf6/ffffff?text=JS',
    createdAt: new Date('2023-02-20')
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://via.placeholder.com/64/10b981/ffffff?text=BJ',
    createdAt: new Date('2023-03-10')
  }
];

// Components
const DateSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [daysToAdd, setDaysToAdd] = useState(7);

  const futureDate = addDays(selectedDate, daysToAdd);

  return (
    <div className="demo-section">
      <h2>📅 Date Utilities</h2>
      <div className="form-group">
        <label>Select Date:</label>
        <input
          type="date"
          value={formatDate(selectedDate, 'YYYY-MM-DD')}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label>Days to Add:</label>
        <input
          type="number"
          value={daysToAdd}
          onChange={(e) => setDaysToAdd(parseInt(e.target.value) || 0)}
          className="form-control"
        />
      </div>

      <div className="results">
        <h4>Results:</h4>
        <p><strong>Selected Date:</strong> <DateDisplay date={selectedDate} format="MMMM DD, YYYY" /></p>
        <p><strong>Future Date (+{daysToAdd} days):</strong> <DateDisplay date={futureDate} format="MMMM DD, YYYY" /></p>
        <p><strong>ISO Format:</strong> {formatDate(selectedDate, 'YYYY-MM-DD')}</p>
        <p><strong>US Format:</strong> {formatDate(selectedDate, 'MM/DD/YYYY')}</p>
      </div>
    </div>
  );
};

const StringSection: React.FC = () => {
  const [inputText, setInputText] = useLocalStorage('demo-string-input', 'hello world example');
  const debouncedText = useDebounce(inputText, 300);

  const transformations = {
    capitalize: capitalize(debouncedText),
    camelCase: camelCase(debouncedText),
    upperCase: debouncedText.toUpperCase(),
    lowerCase: debouncedText.toLowerCase()
  };

  return (
    <div className="demo-section">
      <h2>🔤 String Utilities with Debounce</h2>
      <div className="form-group">
        <label>Enter Text (debounced 300ms):</label>
        <DebounceInput
          value={inputText}
          onDebouncedChange={setInputText}
          debounceMs={300}
          className="form-control"
          placeholder="Type to see transformations..."
        />
      </div>

      <div className="results">
        <h4>Live Transformations:</h4>
        <For each={Object.entries(transformations)}>
          {([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> "{value}"
            </p>
          )}
        </For>
      </div>
    </div>
  );
};

const NumberSection: React.FC = () => {
  const [amount, setAmount] = useState(1234.56);
  const [currency, setCurrency] = useState('USD');

  return (
    <div className="demo-section">
      <h2>🔢 Number Utilities</h2>
      <div className="form-group">
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          className="form-control"
          step="0.01"
        />
      </div>

      <div className="form-group">
        <label>Currency:</label>
        <select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
          className="form-control"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>
      </div>

      <div className="results">
        <h4>Formatted Values:</h4>
        <p><strong>Currency:</strong> <CurrencyDisplay amount={amount} currency={currency} /></p>
        <p><strong>Percentage:</strong> {formatCurrency(amount / 100, { style: 'percent' })}</p>
        <p><strong>Raw Number:</strong> {amount.toLocaleString()}</p>
      </div>
    </div>
  );
};

const ValidationSection: React.FC = () => {
  const [email, setEmail] = useLocalStorage('demo-email', 'test@example.com');
  const [phone, setPhone] = useLocalStorage('demo-phone', '123-456-7890');

  const emailValid = isEmail(email);
  const phoneValid = isPhone(phone);

  return (
    <div className="demo-section">
      <h2>✅ Validation Utilities</h2>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`form-control ${emailValid ? 'valid' : 'invalid'}`}
          placeholder="Enter email address"
        />
        <span className={`validation-indicator ${emailValid ? 'valid' : 'invalid'}`}>
          {emailValid ? '✓ Valid email' : '✗ Invalid email'}
        </span>
      </div>

      <div className="form-group">
        <label>Phone:</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`form-control ${phoneValid ? 'valid' : 'invalid'}`}
          placeholder="Enter phone number"
        />
        <span className={`validation-indicator ${phoneValid ? 'valid' : 'invalid'}`}>
          {phoneValid ? '✓ Valid phone' : '✗ Invalid phone'}
        </span>
      </div>
    </div>
  );
};

const ColorSection: React.FC = () => {
  const [baseColor, setBaseColor] = useState('#3498db');

  const rgb = hexToRgb(baseColor);
  const lightColor = lighten(baseColor, 30);
  const darkColor = darken(baseColor, 30);

  const colors = [
    { name: 'Original', value: baseColor },
    { name: 'Light (+30%)', value: lightColor },
    { name: 'Dark (-30%)', value: darkColor }
  ];

  return (
    <div className="demo-section">
      <h2>🎨 Color Utilities</h2>
      <div className="form-group">
        <label>Base Color:</label>
        <input
          type="color"
          value={baseColor}
          onChange={(e) => setBaseColor(e.target.value)}
          className="color-picker"
        />
      </div>

      <div className="results">
        <h4>Color Information:</h4>
        <If condition={rgb !== null}>
          <p><strong>RGB:</strong> rgb({rgb?.r}, {rgb?.g}, {rgb?.b})</p>
        </If>

        <h4>Color Variations:</h4>
        <div className="color-palette">
          <For each={colors}>
            {(color) => (
              <div key={color.name} className="color-item">
                <div 
                  className="color-swatch"
                  style={{ backgroundColor: color.value }}
                />
                <div className="color-info">
                  <strong>{color.name}</strong>
                  <br />
                  {color.value}
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

const HooksSection: React.FC = () => {
  const [count, increment, decrement, setCount, reset] = useCounter(0);
  const [isVisible, toggleVisible] = useToggle(true);
  const windowSize = useWindowSize();
  const [copied, copyToClipboard] = useCopyToClipboard();

  const throttledIncrement = useThrottledCallback(increment, 1000);

  const handleCopy = () => {
    copyToClipboard('Support.js Framework is awesome!');
  };

  return (
    <div className="demo-section">
      <h2>🎣 Custom Hooks Demo</h2>
      
      <div className="hook-demo">
        <h4>useCounter Hook:</h4>
        <p>Count: <strong>{count}</strong></p>
        <div className="button-group">
          <button onClick={increment} className="btn btn-primary">+1</button>
          <button onClick={decrement} className="btn btn-primary">-1</button>
          <button onClick={throttledIncrement} className="btn btn-secondary">+1 (Throttled 1s)</button>
          <button onClick={() => setCount(10)} className="btn btn-secondary">Set to 10</button>
          <button onClick={reset} className="btn btn-danger">Reset</button>
        </div>
      </div>

      <div className="hook-demo">
        <h4>useToggle Hook:</h4>
        <button onClick={toggleVisible} className="btn btn-primary">
          {isVisible ? 'Hide' : 'Show'} Content
        </button>
        <Show when={isVisible}>
          <div className="toggle-content">
            <p>This content is toggleable! 🎉</p>
          </div>
        </Show>
      </div>

      <div className="hook-demo">
        <h4>useWindowSize Hook:</h4>
        <p>Window Size: <strong>{windowSize.width} × {windowSize.height}</strong></p>
        <p><em>Resize the window to see live updates</em></p>
      </div>

      <div className="hook-demo">
        <h4>useCopyToClipboard Hook:</h4>
        <button onClick={handleCopy} className="btn btn-primary">
          Copy Text to Clipboard
        </button>
        <Show when={copied}>
          <span className="success-message">✓ Copied to clipboard!</span>
        </Show>
      </div>
    </div>
  );
};

const AsyncSection: React.FC = () => {
  const fetchUsers = async (): Promise<User[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return sampleUsers;
  };

  const { data: users, loading, error } = useAsync(fetchUsers, []);

  return (
    <div className="demo-section">
      <h2>🔄 Async State Management</h2>
      
      <Show when={loading}>
        <div className="loading">Loading users...</div>
      </Show>

      <Show when={error !== null}>
        <div className="error">Error: {error?.message}</div>
      </Show>

      <Show when={!loading && users !== null}>
        <div className="user-list">
          <h4>Users ({users?.length || 0}):</h4>
          <For each={users || []}>
            {(user) => (
              <div key={user.id} className="user-card">
                <LazyImage
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar"
                  placeholder="https://via.placeholder.com/64/cccccc/666666?text=..."
                />
                <div className="user-info">
                  <h5>{user.name}</h5>
                  <p>{user.email}</p>
                  <small>
                    Member since: <DateDisplay date={user.createdAt} format="MMM YYYY" />
                  </small>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

const StorageSection: React.FC = () => {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('demo-todos', []);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority: 'medium'
      };
      setTodos([...todos, todo]);
      setNewTodo('');
      logger.info('Todo added', { todo });
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
    logger.info('Todo deleted', { id });
  };

  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="demo-section">
      <h2>💾 Storage & State Management</h2>
      
      <div className="todo-stats">
        <p>Total: <strong>{todos.length}</strong> | Completed: <strong>{completedCount}</strong></p>
      </div>

      <div className="form-group">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          className="form-control"
        />
        <button onClick={addTodo} className="btn btn-primary">Add Todo</button>
      </div>

      <div className="todo-list">
        <For each={todos} fallback={<p className="empty-state">No todos yet. Add one above!</p>}>
          {(todo) => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className="todo-text">{todo.text}</span>
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

// Error Fallback Component
const ErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ error, resetError }) => (
  <div className="error-boundary">
    <h2>Oops! Something went wrong 😕</h2>
    <p><strong>Error:</strong> {error.message}</p>
    <button onClick={resetError} className="btn btn-primary">
      Try Again
    </button>
  </div>
);

// Main App Component
const App: React.FC = () => {
  useEffect(() => {
    logger.info('React Demo App initialized', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
  }, []);

  return (
    <ErrorBoundary 
      fallback={ErrorFallback}
      onError={(error, errorInfo) => {
        logger.error('React Error Boundary caught error', { error, errorInfo });
      }}
    >
      <div className="app">
        <header className="app-header">
          <h1>🚀 Support.js Framework - React Demo</h1>
          <p>Interactive demonstration of React integration with custom hooks and components</p>
        </header>

        <main className="app-main">
          <DateSection />
          <StringSection />
          <NumberSection />
          <ValidationSection />
          <ColorSection />
          <HooksSection />
          <AsyncSection />
          <StorageSection />
        </main>

        <footer className="app-footer">
          <p>Built with Support.js Framework | React Integration Demo</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
