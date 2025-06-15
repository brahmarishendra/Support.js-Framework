import { TestBed } from '@angular/core/testing';
import { LoggerService, LogLevel } from '../../../src/angular/services/logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleSpy: {
    error: jest.SpyInstance;
    warn: jest.SpyInstance;
    info: jest.SpyInstance;
    debug: jest.SpyInstance;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
    
    // Spy on console methods
    consoleSpy = {
      error: jest.spyOn(console, 'error').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      debug: jest.spyOn(console, 'debug').mockImplementation()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('log levels', () => {
    it('should set and get log level', () => {
      service.setLogLevel(LogLevel.ERROR);
      expect(service.getLogLevel()).toBe(LogLevel.ERROR);
    });

    it('should only log messages at or below current level', () => {
      service.setLogLevel(LogLevel.WARN);
      
      service.error('Error message');
      service.warn('Warning message');
      service.info('Info message'); // Should not log
      service.debug('Debug message'); // Should not log
      
      expect(consoleSpy.error).toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.debug).not.toHaveBeenCalled();
    });
  });

  describe('logging methods', () => {
    beforeEach(() => {
      service.setLogLevel(LogLevel.DEBUG); // Allow all logs
    });

    it('should log error messages', () => {
      service.error('Test error', { extra: 'data' });
      
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'Test error',
        { extra: 'data' }
      );
    });

    it('should log warning messages', () => {
      service.warn('Test warning');
      
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'Test warning'
      );
    });

    it('should log info messages', () => {
      service.info('Test info');
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'Test info'
      );
    });

    it('should log debug messages', () => {
      service.debug('Test debug');
      
      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        'Test debug'
      );
    });
  });

  describe('log storage', () => {
    beforeEach(() => {
      service.setLogLevel(LogLevel.DEBUG);
    });

    it('should store log entries', () => {
      service.info('Test message');
      
      const logs = service.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe('Test message');
      expect(logs[0].level).toBe(LogLevel.INFO);
    });

    it('should clear logs', () => {
      service.info('Test message');
      expect(service.getLogs()).toHaveLength(1);
      
      service.clearLogs();
      expect(service.getLogs()).toHaveLength(0);
    });

    it('should filter logs by level', () => {
      service.error('Error message');
      service.warn('Warning message');
      service.info('Info message');
      
      const errorLogs = service.getLogsByLevel(LogLevel.ERROR);
      expect(errorLogs).toHaveLength(1);
      expect(errorLogs[0].message).toBe('Error message');
    });

    it('should export logs as JSON', () => {
      service.info('Test message');
      
      const exported = service.exportLogs();
      const parsed = JSON.parse(exported);
      
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed[0].message).toBe('Test message');
    });
  });
});
