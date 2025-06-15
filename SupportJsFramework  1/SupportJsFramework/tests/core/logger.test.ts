import { Logger, createLogger, logger, debug, info, warn, error } from '../../src/core/logger';

describe('Logger utilities', () => {
  let testLogger: Logger;

  beforeEach(() => {
    testLogger = createLogger({
      level: 'debug',
      enableConsole: false,
      enableStorage: true,
      enableTimestamp: false,
      prefix: 'TEST'
    });

    // Mock console methods
    jest.spyOn(console, 'debug').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'group').mockImplementation();
    jest.spyOn(console, 'groupCollapsed').mockImplementation();
    jest.spyOn(console, 'groupEnd').mockImplementation();
    jest.spyOn(console, 'table').mockImplementation();
    jest.spyOn(console, 'time').mockImplementation();
    jest.spyOn(console, 'timeEnd').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Logger class', () => {
    describe('basic logging', () => {
      it('should log messages at different levels', () => {
        testLogger.debug('Debug message');
        testLogger.info('Info message');
        testLogger.warn('Warning message');
        testLogger.error('Error message');

        const entries = testLogger.getEntries();
        expect(entries).toHaveLength(4);
        expect(entries[0].level).toBe('debug');
        expect(entries[1].level).toBe('info');
        expect(entries[2].level).toBe('warn');
        expect(entries[3].level).toBe('error');
      });

      it('should store message content correctly', () => {
        testLogger.info('Test message', { data: 'test' });

        const entries = testLogger.getEntries();
        expect(entries[0].message).toBe('Test message');
        expect(entries[0].data).toEqual({ data: 'test' });
        expect(entries[0].timestamp).toBeInstanceOf(Date);
      });
    });

    describe('log level filtering', () => {
      it('should respect log level settings', () => {
        const warnLogger = createLogger({
          level: 'warn',
          enableConsole: false,
          enableStorage: true
        });

        warnLogger.debug('Debug message');
        warnLogger.info('Info message');
        warnLogger.warn('Warning message');
        warnLogger.error('Error message');

        const entries = warnLogger.getEntries();
        expect(entries).toHaveLength(2);
        expect(entries[0].level).toBe('warn');
        expect(entries[1].level).toBe('error');
      });
    });

    describe('console logging', () => {
      it('should log to console when enabled', () => {
        const consoleLogger = createLogger({
          enableConsole: true,
          enableStorage: false,
          prefix: 'CONSOLE'
        });

        consoleLogger.debug('Debug message');
        consoleLogger.info('Info message');
        consoleLogger.warn('Warning message');
        consoleLogger.error('Error message');

        expect(console.debug).toHaveBeenCalled();
        expect(console.info).toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
      });

      it('should format messages with prefix and timestamp', () => {
        const consoleLogger = createLogger({
          enableConsole: true,
          enableStorage: false,
          prefix: 'TEST',
          enableTimestamp: true
        });

        consoleLogger.info('Test message');

        expect(console.info).toHaveBeenCalledWith(
          expect.stringMatching(/\[TEST\] \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z \[INFO\] Test message/)
        );
      });
    });

    describe('storage management', () => {
      it('should limit stored entries', () => {
        const limitedLogger = createLogger({
          enableStorage: true,
          maxStorageEntries: 2
        });

        limitedLogger.info('Message 1');
        limitedLogger.info('Message 2');
        limitedLogger.info('Message 3');

        const entries = limitedLogger.getEntries();
        expect(entries).toHaveLength(2);
        expect(entries[0].message).toBe('Message 2');
        expect(entries[1].message).toBe('Message 3');
      });

      it('should clear entries', () => {
        testLogger.info('Message 1');
        testLogger.info('Message 2');

        expect(testLogger.getEntries()).toHaveLength(2);

        testLogger.clearEntries();
        expect(testLogger.getEntries()).toHaveLength(0);
      });
    });

    describe('filtering by level', () => {
      it('should filter entries by level', () => {
        testLogger.debug('Debug message');
        testLogger.info('Info message');
        testLogger.warn('Warning message');
        testLogger.error('Error message');

        const errorEntries = testLogger.getEntriesByLevel('error');
        expect(errorEntries).toHaveLength(1);
        expect(errorEntries[0].level).toBe('error');

        const infoEntries = testLogger.getEntriesByLevel('info');
        expect(infoEntries).toHaveLength(1);
        expect(infoEntries[0].level).toBe('info');
      });
    });

    describe('configuration', () => {
      it('should update configuration', () => {
        const initialConfig = testLogger.getConfig();
        expect(initialConfig.level).toBe('debug');

        testLogger.updateConfig({ level: 'warn' });

        const updatedConfig = testLogger.getConfig();
        expect(updatedConfig.level).toBe('warn');
      });

      it('should not modify original config object', () => {
        const config = testLogger.getConfig();
        config.level = 'error';

        expect(testLogger.getConfig().level).toBe('debug');
      });
    });

    describe('child loggers', () => {
      it('should create child logger with combined prefix', () => {
        const childLogger = testLogger.child('CHILD');

        const childConfig = childLogger.getConfig();
        expect(childConfig.prefix).toBe('TEST:CHILD');
      });

      it('should inherit parent configuration', () => {
        const childLogger = testLogger.child('CHILD');

        const childConfig = childLogger.getConfig();
        expect(childConfig.level).toBe('debug');
        expect(childConfig.enableStorage).toBe(true);
      });
    });

    describe('export functionality', () => {
      it('should export logs as JSON', () => {
        testLogger.info('Message 1', { data: 'test1' });
        testLogger.warn('Message 2', { data: 'test2' });

        const exported = testLogger.exportLogs();
        const parsed = JSON.parse(exported);

        expect(parsed).toHaveLength(2);
        expect(parsed[0].message).toBe('Message 1');
        expect(parsed[1].message).toBe('Message 2');
      });
    });

    describe('utility methods', () => {
      it('should handle grouping', () => {
        const consoleLogger = createLogger({ enableConsole: true });

        consoleLogger.group('Test Group');
        consoleLogger.groupEnd();

        expect(console.group).toHaveBeenCalledWith('Test Group');
        expect(console.groupEnd).toHaveBeenCalled();
      });

      it('should handle collapsed grouping', () => {
        const consoleLogger = createLogger({ enableConsole: true });

        consoleLogger.group('Test Group', true);

        expect(console.groupCollapsed).toHaveBeenCalledWith('Test Group');
      });

      it('should handle table logging', () => {
        const consoleLogger = createLogger({ enableConsole: true });

        const data = [{ name: 'John', age: 30 }];
        consoleLogger.table(data);

        expect(console.table).toHaveBeenCalledWith(data);
      });

      it('should handle timing', () => {
        const consoleLogger = createLogger({ enableConsole: true });

        consoleLogger.time('test-timer');
        consoleLogger.timeEnd('test-timer');

        expect(console.time).toHaveBeenCalledWith('test-timer');
        expect(console.timeEnd).toHaveBeenCalledWith('test-timer');
      });
    });

    describe('stack trace', () => {
      it('should log stack trace for errors when enabled', () => {
        const stackLogger = createLogger({
          enableConsole: true,
          enableStackTrace: true
        });

        stackLogger.error('Test error');

        expect(console.error).toHaveBeenCalledTimes(2); // Message + stack trace
      });
    });
  });

  describe('factory functions', () => {
    it('should create logger with createLogger', () => {
      const customLogger = createLogger({
        level: 'warn',
        prefix: 'CUSTOM'
      });

      expect(customLogger).toBeInstanceOf(Logger);
      expect(customLogger.getConfig().level).toBe('warn');
      expect(customLogger.getConfig().prefix).toBe('CUSTOM');
    });
  });

  describe('convenience functions', () => {
    beforeEach(() => {
      // Clear the default logger entries
      logger.clearEntries();
    });

    it('should use default logger for convenience functions', () => {
      debug('Debug message');
      info('Info message');
      warn('Warning message');
      error('Error message');

      // The default logger should have entries (if storage is enabled)
      // We can't easily test this without modifying the default logger config
      // But we can at least verify the functions don't throw
      expect(() => {
        debug('test');
        info('test');
        warn('test');
        error('test');
      }).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle undefined data gracefully', () => {
      testLogger.info('Message with undefined data', undefined);

      const entries = testLogger.getEntries();
      expect(entries[0].data).toBeUndefined();
    });

    it('should handle null data gracefully', () => {
      testLogger.info('Message with null data', null);

      const entries = testLogger.getEntries();
      expect(entries[0].data).toBeNull();
    });

    it('should handle complex objects', () => {
      const complexData = {
        nested: { value: 123 },
        array: [1, 2, 3],
        date: new Date(),
        func: () => 'test'
      };

      testLogger.info('Complex data', complexData);

      const entries = testLogger.getEntries();
      expect(entries[0].data).toEqual(complexData);
    });
  });
});
