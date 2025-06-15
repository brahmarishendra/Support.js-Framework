import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, interval } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import {
  SupportLoggerService,
  SupportStorageService,
  SupportBrowserService,
  SupportPerformanceService,
  SupportStateService,
  SupportErrorService,
  SupportUtilsService
} from 'support-js-framework/angular';

import {
  formatDate,
  addDays,
  formatCurrency,
  hexToRgb,
  lighten,
  darken,
  isEmail,
  isPhone,
  validatePasswordStrength
} from 'support-js-framework/core';

interface User {
  id: number;
  name: string;
  email: string;
  joinDate: Date;
  isActive: boolean;
}

interface AppState {
  users: User[];
  currentUser: User | null;
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
  metrics: {
    totalUsers: number;
    activeUsers: number;
    revenue: number;
  };
}

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
}

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <h1>🚀 Support.js Framework - Angular Demo</h1>
        <p>Comprehensive demonstration of Angular services, pipes, and utilities</p>
        <div class="browser-info">
          <strong>Browser:</strong> {{ browserInfo.name }} {{ browserInfo.version }} |
          <strong>OS:</strong> {{ browserInfo.os }} |
          <strong>Device:</strong> {{ getDeviceType() }}
        </div>
      </header>

      <!-- Main Content -->
      <main class="app-main">
        <!-- Date Utilities Section -->
        <section class="demo-section">
          <h2>📅 Date Utilities & Pipes</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="selectedDate">Select Date:</label>
              <input 
                type="date" 
                id="selectedDate"
                [value]="selectedDate | supportDate:'YYYY-MM-DD'" 
                (change)="onDateChange($event)"
                class="form-control">
            </div>
            <div class="form-group">
              <label for="daysToAdd">Days to Add:</label>
              <input 
                type="number" 
                id="daysToAdd"
                [(ngModel)]="daysToAdd" 
                class="form-control">
            </div>
          </div>
          
          <div class="results-grid">
            <div class="result-item">
              <strong>Selected Date:</strong>
              {{ selectedDate | supportDate:'MMMM DD, YYYY' }}
            </div>
            <div class="result-item">
              <strong>Future Date (+{{ daysToAdd }} days):</strong>
              {{ getFutureDate() | supportDate:'MMMM DD, YYYY' }}
            </div>
            <div class="result-item">
              <strong>ISO Format:</strong>
              {{ selectedDate | supportDate:'YYYY-MM-DD' }}
            </div>
            <div class="result-item">
              <strong>Time Ago:</strong>
              {{ selectedDate | supportTimeAgo }}
            </div>
          </div>
        </section>

        <!-- String Utilities Section -->
        <section class="demo-section">
          <h2>🔤 String Utilities & Pipes</h2>
          <div class="form-group">
            <label for="stringInput">Enter Text:</label>
            <input 
              type="text" 
              id="stringInput"
              [(ngModel)]="inputText" 
              placeholder="Enter text to transform..."
              class="form-control">
          </div>
          
          <div class="string-transformations">
            <div class="transform-item">
              <strong>Original:</strong> "{{ inputText }}"
            </div>
            <div class="transform-item">
              <strong>Capitalize:</strong> "{{ inputText | supportCapitalize }}"
            </div>
            <div class="transform-item">
              <strong>camelCase:</strong> "{{ inputText | supportCamelCase }}"
            </div>
            <div class="transform-item">
              <strong>kebab-case:</strong> "{{ inputText | supportKebabCase }}"
            </div>
            <div class="transform-item">
              <strong>Truncated (20):</strong> "{{ inputText | supportTruncate:20 }}"
            </div>
          </div>
        </section>

        <!-- Number & Currency Section -->
        <section class="demo-section">
          <h2>💰 Number & Currency Utilities</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="amount">Amount:</label>
              <input 
                type="number" 
                id="amount"
                [(ngModel)]="amount" 
                step="0.01"
                class="form-control">
            </div>
            <div class="form-group">
              <label for="currency">Currency:</label>
              <select id="currency" [(ngModel)]="currency" class="form-control">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>
          
          <div class="results-grid">
            <div class="result-item">
              <strong>Currency:</strong>
              {{ amount | supportCurrency:currency }}
            </div>
            <div class="result-item">
              <strong>Percentage:</strong>
              {{ (amount / 100) | supportPercentage:2 }}
            </div>
            <div class="result-item">
              <strong>File Size:</strong>
              {{ amount | supportFileSize }}
            </div>
            <div class="result-item">
              <strong>Raw Number:</strong>
              {{ amount | number:'1.2-2' }}
            </div>
          </div>
        </section>

        <!-- Validation Section -->
        <section class="demo-section">
          <h2>✅ Form Validation</h2>
          <form [formGroup]="validationForm" class="validation-form">
            <div class="form-group">
              <label for="email">Email:</label>
              <input 
                type="email" 
                id="email"
                formControlName="email"
                [class.valid]="isEmailValid()"
                [class.invalid]="isEmailInvalid()"
                class="form-control">
              <span class="validation-feedback" 
                    [class.valid]="isEmailValid()" 
                    [class.invalid]="isEmailInvalid()">
                {{ getEmailValidationMessage() }}
              </span>
            </div>
            
            <div class="form-group">
              <label for="phone">Phone:</label>
              <input 
                type="tel" 
                id="phone"
                formControlName="phone"
                [class.valid]="isPhoneValid()"
                [class.invalid]="isPhoneInvalid()"
                class="form-control">
              <span class="validation-feedback" 
                    [class.valid]="isPhoneValid()" 
                    [class.invalid]="isPhoneInvalid()">
                {{ getPhoneValidationMessage() }}
              </span>
            </div>
            
            <div class="form-group">
              <label for="password">Password:</label>
              <input 
                type="password" 
                id="password"
                formControlName="password"
                class="form-control">
              <div class="password-strength" *ngIf="validationForm.get('password')?.value">
                <div class="strength-bar">
                  <div class="strength-fill" 
                       [style.width.%]="passwordStrength.score * 25"
                       [class]="'strength-' + passwordStrength.score"></div>
                </div>
                <p class="strength-text">
                  Strength: {{ getPasswordStrengthText() }} ({{ passwordStrength.score }}/4)
                </p>
                <ul class="feedback-list" *ngIf="passwordStrength.feedback.length > 0">
                  <li *ngFor="let feedback of passwordStrength.feedback">{{ feedback }}</li>
                </ul>
              </div>
            </div>
          </form>
        </section>

        <!-- Color Utilities Section -->
        <section class="demo-section">
          <h2>🎨 Color Utilities</h2>
          <div class="form-group">
            <label for="colorPicker">Base Color:</label>
            <input 
              type="color" 
              id="colorPicker"
              [(ngModel)]="selectedColor" 
              class="color-picker">
          </div>
          
          <div class="color-palette">
            <div class="color-item">
              <div class="color-swatch" [style.background-color]="selectedColor"></div>
              <div class="color-info">
                <strong>Original</strong><br>
                {{ selectedColor }}<br>
                RGB: {{ getColorRGB() }}
              </div>
            </div>
            <div class="color-item">
              <div class="color-swatch" [style.background-color]="getLighterColor()"></div>
              <div class="color-info">
                <strong>Lighter (+30%)</strong><br>
                {{ getLighterColor() }}
              </div>
            </div>
            <div class="color-item">
              <div class="color-swatch" [style.background-color]="getDarkerColor()"></div>
              <div class="color-info">
                <strong>Darker (-30%)</strong><br>
                {{ getDarkerColor() }}
              </div>
            </div>
          </div>
        </section>

        <!-- State Management Section -->
        <section class="demo-section">
          <h2>🏪 State Management</h2>
          <div class="state-controls">
            <button (click)="loadUsers()" [disabled]="loading" class="btn btn-primary">
              {{ loading ? 'Loading...' : 'Load Users' }}
            </button>
            <button (click)="addUser()" class="btn btn-secondary">Add Random User</button>
            <button (click)="clearUsers()" class="btn btn-danger">Clear Users</button>
          </div>
          
          <div class="users-list" *ngIf="(appState$ | async)?.users.length">
            <h4>Users ({{ (appState$ | async)?.users.length }}):</h4>
            <div class="user-grid">
              <div 
                *ngFor="let user of (appState$ | async)?.users; let i = index" 
                class="user-card"
                [class.active]="user.isActive">
                <div class="user-info">
                  <strong>{{ user.name }}</strong><br>
                  {{ user.email }}<br>
                  <small>Joined: {{ user.joinDate | supportDate:'MMM YYYY' }}</small>
                </div>
                <div class="user-actions">
                  <button (click)="toggleUserStatus(user.id)" class="btn btn-sm">
                    {{ user.isActive ? 'Deactivate' : 'Activate' }}
                  </button>
                  <button (click)="removeUser(user.id)" class="btn btn-sm btn-danger">Remove</button>
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="!(appState$ | async)?.users.length" class="empty-state">
            No users found. Click "Load Users" to get started.
          </div>
        </section>

        <!-- Todo List with Storage -->
        <section class="demo-section">
          <h2>📝 Todo List with Local Storage</h2>
          <div class="todo-form">
            <input 
              type="text" 
              [(ngModel)]="newTodoTitle"
              (keyup.enter)="addTodo()"
              placeholder="Enter todo title..."
              class="form-control">
            <select [(ngModel)]="newTodoPriority" class="form-control">
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button (click)="addTodo()" [disabled]="!newTodoTitle.trim()" class="btn btn-primary">
              Add Todo
            </button>
          </div>
          
          <div class="todo-stats" *ngIf="todos.length">
            <span>Total: {{ todos.length }}</span>
            <span>Completed: {{ getCompletedCount() }}</span>
            <span>Pending: {{ todos.length - getCompletedCount() }}</span>
          </div>
          
          <div class="todo-list">
            <div 
              *ngFor="let todo of todos | supportSort:'priority':'desc'; let i = index" 
              class="todo-item"
              [class.completed]="todo.completed"
              [class]="'priority-' + todo.priority">
              <input 
                type="checkbox" 
                [checked]="todo.completed"
                (change)="toggleTodo(todo.id)">
              <div class="todo-content">
                <span class="todo-title">{{ todo.title }}</span>
                <div class="todo-meta">
                  <span class="priority">{{ todo.priority | supportCapitalize }}</span>
                  <span class="date">{{ todo.createdAt | supportTimeAgo }}</span>
                </div>
              </div>
              <button (click)="deleteTodo(todo.id)" class="btn btn-sm btn-danger">Delete</button>
            </div>
          </div>
          
          <div *ngIf="!todos.length" class="empty-state">
            No todos yet. Add one above to get started!
          </div>
        </section>

        <!-- Performance & Browser Info -->
        <section class="demo-section">
          <h2>⚡ Performance & Browser Info</h2>
          <div class="info-grid">
            <div class="info-card">
              <h4>Browser Information</h4>
              <p><strong>Name:</strong> {{ browserInfo.name }}</p>
              <p><strong>Version:</strong> {{ browserInfo.version }}</p>
              <p><strong>OS:</strong> {{ browserInfo.os }}</p>
              <p><strong>Mobile:</strong> {{ browserInfo.isMobile ? 'Yes' : 'No' }}</p>
            </div>
            
            <div class="info-card">
              <h4>Storage Information</h4>
              <p><strong>Local Storage:</strong> {{ storageService.isLocalStorageAvailable() ? 'Available' : 'Not Available' }}</p>
              <p><strong>Session Storage:</strong> {{ storageService.isSessionStorageAvailable() ? 'Available' : 'Not Available' }}</p>
              <button (click)="testStorage()" class="btn btn-secondary">Test Storage</button>
            </div>
            
            <div class="info-card">
              <h4>Utility Functions</h4>
              <button (click)="copyToClipboard()" class="btn btn-secondary">Copy to Clipboard</button>
              <button (click)="downloadLogs()" class="btn btn-secondary">Download Logs</button>
              <button (click)="generateId()" class="btn btn-secondary">Generate ID</button>
              <p *ngIf="lastGeneratedId"><strong>Last ID:</strong> {{ lastGeneratedId }}</p>
            </div>
          </div>
        </section>

        <!-- Real-time Clock -->
        <section class="demo-section">
          <h2>🕐 Real-time Clock with Performance Optimization</h2>
          <div class="clock-display">
            <div class="current-time">
              {{ currentTime | supportDate:'YYYY-MM-DD HH:mm:ss' }}
            </div>
            <div class="clock-controls">
              <button (click)="startClock()" [disabled]="clockRunning" class="btn btn-primary">Start Clock</button>
              <button (click)="stopClock()" [disabled]="!clockRunning" class="btn btn-danger">Stop Clock</button>
            </div>
            <p><small>Clock updates are throttled to once per second for performance</small></p>
          </div>
        </section>

        <!-- Error Handling Demo -->
        <section class="demo-section">
          <h2>🚨 Error Handling</h2>
          <div class="error-demo">
            <button (click)="triggerError()" class="btn btn-warning">Trigger Test Error</button>
            <button (click)="clearErrors()" class="btn btn-secondary">Clear Errors</button>
            
            <div *ngIf="lastError$ | async as error" class="error-display">
              <h4>Latest Error:</h4>
              <p><strong>Message:</strong> {{ error.message }}</p>
              <p><strong>Time:</strong> {{ error.name | supportDefault:'Unknown Error' }}</p>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <p>Built with Support.js Framework | Angular Integration Demo</p>
        <p>Generated at: {{ new Date() | supportDate:'YYYY-MM-DD HH:mm:ss' }}</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .app-header {
      text-align: center;
      margin-bottom: 40px;
      padding: 40px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
    }

    .app-header h1 {
      margin: 0 0 10px 0;
      font-size: 2.5rem;
    }

    .browser-info {
      margin-top: 20px;
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .demo-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .demo-section h2 {
      margin: 0 0 20px 0;
      color: #333;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .form-control.valid {
      border-color: #28a745;
    }

    .form-control.invalid {
      border-color: #dc3545;
    }

    .color-picker {
      width: 60px;
      height: 60px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      margin-right: 10px;
      margin-bottom: 10px;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-warning {
      background: #ffc107;
      color: #212529;
    }

    .btn-sm {
      padding: 5px 10px;
      font-size: 12px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }

    .result-item {
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #667eea;
    }

    .string-transformations {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }

    .transform-item {
      padding: 8px 0;
      border-bottom: 1px solid #e9ecef;
    }

    .transform-item:last-child {
      border-bottom: none;
    }

    .validation-feedback {
      display: block;
      margin-top: 5px;
      font-size: 0.9rem;
    }

    .validation-feedback.valid {
      color: #28a745;
    }

    .validation-feedback.invalid {
      color: #dc3545;
    }

    .password-strength {
      margin-top: 10px;
    }

    .strength-bar {
      width: 100%;
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }

    .strength-fill {
      height: 100%;
      transition: width 0.3s ease;
    }

    .strength-fill.strength-0,
    .strength-fill.strength-1 {
      background: #dc3545;
    }

    .strength-fill.strength-2 {
      background: #ffc107;
    }

    .strength-fill.strength-3,
    .strength-fill.strength-4 {
      background: #28a745;
    }

    .feedback-list {
      margin: 10px 0;
      padding-left: 20px;
      color: #dc3545;
      font-size: 0.9rem;
    }

    .color-palette {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .color-item {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .color-swatch {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      border: 2px solid #e9ecef;
    }

    .state-controls {
      margin-bottom: 20px;
    }

    .users-list h4 {
      margin-bottom: 15px;
    }

    .user-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
    }

    .user-card {
      padding: 15px;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .user-card.active {
      border-color: #28a745;
      background: #d4edda;
    }

    .user-actions {
      margin-top: 10px;
    }

    .todo-form {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 10px;
      margin-bottom: 20px;
    }

    .todo-stats {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      padding: 10px;
      background: #e9ecef;
      border-radius: 6px;
    }

    .todo-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .todo-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      margin-bottom: 10px;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      background: white;
    }

    .todo-item.completed {
      opacity: 0.7;
      background: #f8f9fa;
    }

    .todo-item.priority-high {
      border-left: 4px solid #dc3545;
    }

    .todo-item.priority-medium {
      border-left: 4px solid #ffc107;
    }

    .todo-item.priority-low {
      border-left: 4px solid #28a745;
    }

    .todo-content {
      flex: 1;
    }

    .todo-title {
      display: block;
      font-weight: 500;
    }

    .todo-item.completed .todo-title {
      text-decoration: line-through;
    }

    .todo-meta {
      display: flex;
      gap: 15px;
      margin-top: 5px;
      font-size: 0.9rem;
      color: #666;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .info-card {
      padding: 20px;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .info-card h4 {
      margin: 0 0 15px 0;
      color: #495057;
    }

    .clock-display {
      text-align: center;
      padding: 20px;
    }

    .current-time {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 20px;
    }

    .clock-controls {
      margin-bottom: 10px;
    }

    .error-display {
      margin-top: 20px;
      padding: 15px;
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      color: #721c24;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #666;
      font-style: italic;
    }

    .app-footer {
      text-align: center;
      padding: 20px;
      color: #666;
      border-top: 1px solid #e9ecef;
      margin-top: 40px;
    }

    .app-footer p {
      margin: 5px 0;
    }

    @media (max-width: 768px) {
      .app-container {
        padding: 10px;
      }

      .app-header h1 {
        font-size: 1.8rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .todo-form {
        grid-template-columns: 1fr;
      }

      .todo-stats {
        flex-direction: column;
        gap: 5px;
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Component state
  selectedDate = new Date();
  daysToAdd = 7;
  inputText = 'hello world example';
  amount = 1234.56;
  currency = 'USD';
  selectedColor = '#3498db';
  loading = false;
  
  // Todo state
  todos: TodoItem[] = [];
  newTodoTitle = '';
  newTodoPriority: 'low' | 'medium' | 'high' = 'medium';
  
  // Clock state
  currentTime = new Date();
  clockRunning = false;
  
  // Other state
  lastGeneratedId = '';
  
  // Form
  validationForm: FormGroup;
  passwordStrength: any = { score: 0, feedback: [], isValid: false };
  
  // Observables
  appState$: Observable<AppState>;
  lastError$: Observable<Error | null>;
  
  // Browser info
  browserInfo: any;

  constructor(
    private logger: SupportLoggerService,
    private storageService: SupportStorageService,
    private browserService: SupportBrowserService,
    private performanceService: SupportPerformanceService,
    private stateService: SupportStateService<AppState>,
    private errorService: SupportErrorService,
    private utilsService: SupportUtilsService
  ) {
    // Initialize form
    this.validationForm = new FormGroup({
      email: new FormControl('test@example.com', [Validators.required, Validators.email]),
      phone: new FormControl('123-456-7890', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });

    // Get browser info
    this.browserInfo = this.browserService.getBrowserInfo();

    // Initialize state
    this.initializeState();
    
    // Setup observables
    this.appState$ = this.stateService.getState();
    this.lastError$ = this.errorService.getErrors();

    // Load todos from storage
    this.loadTodos();
  }

  ngOnInit(): void {
    this.logger.info('Angular Demo App initialized', {
      timestamp: new Date().toISOString(),
      browserInfo: this.browserInfo
    });

    // Watch form changes
    this.validationForm.get('password')?.valueChanges.subscribe(password => {
      if (password) {
        this.passwordStrength = validatePasswordStrength(password);
      }
    });

    // Setup real-time clock with performance optimization
    this.performanceService.createThrottledObservable(
      interval(100), // Check every 100ms
      1000 // But throttle to 1 second
    ).pipe(
      takeUntil(this.destroy$),
      map(() => new Date())
    ).subscribe(time => {
      if (this.clockRunning) {
        this.currentTime = time;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Date methods
  onDateChange(event: any): void {
    this.selectedDate = new Date(event.target.value);
  }

  getFutureDate(): Date {
    return addDays(this.selectedDate, this.daysToAdd);
  }

  // Validation methods
  isEmailValid(): boolean {
    const control = this.validationForm.get('email');
    return control ? control.valid && control.touched : false;
  }

  isEmailInvalid(): boolean {
    const control = this.validationForm.get('email');
    return control ? control.invalid && control.touched : false;
  }

  isPhoneValid(): boolean {
    const control = this.validationForm.get('phone');
    const value = control?.value;
    return control && control.touched ? isPhone(value) : false;
  }

  isPhoneInvalid(): boolean {
    const control = this.validationForm.get('phone');
    const value = control?.value;
    return control && control.touched ? !isPhone(value) : false;
  }

  getEmailValidationMessage(): string {
    const control = this.validationForm.get('email');
    if (!control?.touched) return '';
    
    const value = control.value;
    if (!value) return '';
    
    return isEmail(value) ? '✓ Valid email' : '✗ Invalid email format';
  }

  getPhoneValidationMessage(): string {
    const control = this.validationForm.get('phone');
    if (!control?.touched) return '';
    
    const value = control.value;
    if (!value) return '';
    
    return isPhone(value) ? '✓ Valid phone' : '✗ Invalid phone format';
  }

  getPasswordStrengthText(): string {
    const strengthTexts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return strengthTexts[this.passwordStrength.score] || 'Very Weak';
  }

  // Color methods
  getColorRGB(): string {
    const rgb = hexToRgb(this.selectedColor);
    return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : 'Invalid';
  }

  getLighterColor(): string {
    return lighten(this.selectedColor, 30);
  }

  getDarkerColor(): string {
    return darken(this.selectedColor, 30);
  }

  // State management methods
  private initializeState(): void {
    const initialState: AppState = {
      users: [],
      currentUser: null,
      settings: {
        theme: 'light',
        notifications: true,
        language: 'en'
      },
      metrics: {
        totalUsers: 0,
        activeUsers: 0,
        revenue: 0
      }
    };
    
    this.stateService.setState(initialState);
  }

  loadUsers(): void {
    this.loading = true;
    this.logger.info('Loading users...');
    
    // Simulate API call
    setTimeout(() => {
      const users: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          joinDate: new Date('2023-01-15'),
          isActive: true
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          joinDate: new Date('2023-02-20'),
          isActive: true
        },
        {
          id: 3,
          name: 'Bob Johnson',
          email: 'bob@example.com',
          joinDate: new Date('2023-03-10'),
          isActive: false
        }
      ];
      
      this.stateService.updateState({ users });
      this.loading = false;
      this.logger.info('Users loaded successfully', { count: users.length });
    }, 1000);
  }

  addUser(): void {
    const names = ['Alice Brown', 'Charlie Wilson', 'Diana Davis', 'Eve Miller', 'Frank Garcia'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const email = randomName.toLowerCase().replace(' ', '.') + '@example.com';
    
    const newUser: User = {
      id: Date.now(),
      name: randomName,
      email,
      joinDate: new Date(),
      isActive: Math.random() > 0.3
    };
    
    const currentState = this.stateService.getCurrentState();
    if (currentState) {
      const updatedUsers = [...currentState.users, newUser];
      this.stateService.updateState({ users: updatedUsers });
      this.logger.info('User added', newUser);
    }
  }

  clearUsers(): void {
    this.stateService.updateState({ users: [] });
    this.logger.info('All users cleared');
  }

  toggleUserStatus(userId: number): void {
    const currentState = this.stateService.getCurrentState();
    if (currentState) {
      const updatedUsers = currentState.users.map(user =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      );
      this.stateService.updateState({ users: updatedUsers });
      this.logger.info('User status toggled', { userId });
    }
  }

  removeUser(userId: number): void {
    const currentState = this.stateService.getCurrentState();
    if (currentState) {
      const updatedUsers = currentState.users.filter(user => user.id !== userId);
      this.stateService.updateState({ users: updatedUsers });
      this.logger.info('User removed', { userId });
    }
  }

  // Todo methods
  private loadTodos(): void {
    const storedTodos = this.storageService.getLocal<TodoItem[]>('angular-demo-todos');
    if (storedTodos) {
      this.todos = storedTodos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
      }));
    }
  }

  private saveTodos(): void {
    this.storageService.setLocal('angular-demo-todos', this.todos);
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      const todo: TodoItem = {
        id: Date.now(),
        title: this.newTodoTitle.trim(),
        completed: false,
        priority: this.newTodoPriority,
        createdAt: new Date()
      };
      
      this.todos = [todo, ...this.todos];
      this.saveTodos();
      this.newTodoTitle = '';
      this.logger.info('Todo added', todo);
    }
  }

  toggleTodo(id: number): void {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.saveTodos();
    this.logger.info('Todo toggled', { id });
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
    this.logger.info('Todo deleted', { id });
  }

  getCompletedCount(): number {
    return this.todos.filter(todo => todo.completed).length;
  }

  // Utility methods
  getDeviceType(): string {
    if (this.browserInfo.isMobile) return 'Mobile';
    if (this.browserInfo.isTablet) return 'Tablet';
    return 'Desktop';
  }

  testStorage(): void {
    const testKey = 'storage-test';
    const testValue = { timestamp: Date.now(), message: 'Storage test successful!' };
    
    // Test local storage
    const localSuccess = this.storageService.setLocal(testKey, testValue);
    const localRetrieved = this.storageService.getLocal(testKey);
    
    this.logger.info('Storage test completed', {
      localStorageSuccess: localSuccess,
      dataIntegrity: JSON.stringify(localRetrieved) === JSON.stringify(testValue)
    });
    
    // Clean up
    this.storageService.removeLocal(testKey);
  }

  async copyToClipboard(): Promise<void> {
    const success = await this.utilsService.copyToClipboard('Support.js Framework Angular Demo - Copied to clipboard!');
    if (success) {
      this.logger.info('Text copied to clipboard successfully');
    } else {
      this.logger.error('Failed to copy text to clipboard');
    }
  }

  downloadLogs(): void {
    const logs = this.logger.exportLogs();
    this.utilsService.downloadFile(logs, `support-js-logs-${formatDate(new Date(), 'YYYY-MM-DD')}.json`, 'application/json');
    this.logger.info('Logs downloaded');
  }

  generateId(): void {
    this.lastGeneratedId = this.utilsService.generateId('demo');
    this.logger.info('ID generated', { id: this.lastGeneratedId });
  }

  // Clock methods
  startClock(): void {
    this.clockRunning = true;
    this.logger.info('Clock started');
  }

  stopClock(): void {
    this.clockRunning = false;
    this.logger.info('Clock stopped');
  }

  // Error handling methods
  triggerError(): void {
    const error = new Error('This is a test error for demonstration purposes');
    this.errorService.handleError(error, 'Demo Error');
  }

  clearErrors(): void {
    this.errorService.clearError();
    this.logger.info('Errors cleared');
  }
}
