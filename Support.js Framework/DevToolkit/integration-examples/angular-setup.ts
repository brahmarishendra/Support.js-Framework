
import { Component, OnInit } from '@angular/core';
import { LoggerService, LogLevel } from 'support.js/angular';
import { dateUtils, stringUtils } from 'support.js/utils';

@Component({
  selector: 'app-angular-example',
  template: `
    <div style="padding: 20px;">
      <h1>Support.js Angular Integration</h1>
      
      <div>
        <h2>Logger Service</h2>
        <button (click)="logInfo()">Log Info</button>
        <button (click)="logWarning()">Log Warning</button>
        <button (click)="logError()">Log Error</button>
        <p>Check console for log output</p>
      </div>

      <div>
        <h2>Utility Functions</h2>
        <p>Current date: {{ currentDate }}</p>
        <p>Processed text: {{ processedText }}</p>
      </div>

      <div>
        <h2>Log Entries</h2>
        <ul>
          <li *ngFor="let log of recentLogs">
            [{{ log.timestamp | date:'short' }}] {{ log.level }}: {{ log.message }}
          </li>
        </ul>
      </div>
    </div>
  `
})
export class AngularExampleComponent implements OnInit {
  currentDate: string = '';
  processedText: string = '';
  recentLogs: any[] = [];

  constructor(private logger: LoggerService) {
    this.logger.setLogLevel(LogLevel.DEBUG);
  }

  ngOnInit() {
    this.currentDate = dateUtils.formatDate(new Date(), 'YYYY-MM-DD HH:mm');
    this.processedText = stringUtils.toCamelCase('angular-integration-example');
    
    this.logger.info('Angular component initialized');
    this.updateLogDisplay();
  }

  logInfo() {
    this.logger.info('Info message from Angular component', { 
      component: 'AngularExampleComponent',
      timestamp: new Date()
    });
    this.updateLogDisplay();
  }

  logWarning() {
    this.logger.warn('Warning message', { level: 'warning' });
    this.updateLogDisplay();
  }

  logError() {
    this.logger.error('Error message', new Error('Example error'));
    this.updateLogDisplay();
  }

  private updateLogDisplay() {
    this.recentLogs = this.logger.getLogs().slice(-5);
  }
}
