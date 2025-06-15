
// Support.js Demo & Performance Testing Script

class SupportJSDemo {
    constructor() {
        this.performanceMetrics = {
            totalTests: 0,
            averageExecutionTime: 0,
            memoryUsage: 0,
            loadTime: 0
        };
        this.initializeDemo();
    }

    initializeDemo() {
        // Record initial load time
        this.performanceMetrics.loadTime = performance.now();
        
        // Update initial metrics
        this.updateInitialMetrics();
        
        console.log('🚀 Support.js Demo initialized');
    }

    updateInitialMetrics() {
        document.getElementById('load-time').textContent = `${this.performanceMetrics.loadTime.toFixed(2)}ms`;
        document.getElementById('memory-usage').textContent = `${(performance.memory ? (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1) : '~2.1')}MB`;
    }

    // String Utils Testing
    testStringUtils() {
        const output = document.getElementById('utils-output');
        const startTime = performance.now();
        
        try {
            const testString = "hello-world-example";
            const longString = "This is a very long string that will be truncated for demonstration purposes";
            
            const results = [];
            results.push(`🔤 String Utils Testing:`);
            results.push(`Original: "${testString}"`);
            results.push(`CamelCase: "${this.toCamelCase(testString)}"`);
            results.push(`Capitalize: "${this.capitalizeString(testString)}"`);
            results.push(`Truncate: "${this.truncateString(longString, 30)}"`);
            results.push(`Reverse: "${this.reverseString(testString)}"`);
            
            const execTime = performance.now() - startTime;
            results.push(`⏱️ Execution Time: ${execTime.toFixed(3)}ms`);
            
            output.innerHTML = results.join('<br>');
            this.updatePerformanceMetrics(execTime);
            
        } catch (error) {
            output.innerHTML = `❌ Error: ${error.message}`;
        }
    }

    // Date Utils Testing
    testDateUtils() {
        const output = document.getElementById('utils-output');
        const startTime = performance.now();
        
        try {
            const currentDate = new Date();
            const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
            const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
            
            const results = [];
            results.push(`📅 Date Utils Testing:`);
            results.push(`Current Date: ${this.formatDate(currentDate, 'YYYY-MM-DD')}`);
            results.push(`Current Time: ${this.formatDate(currentDate, 'HH:mm:ss')}`);
            results.push(`Relative Time (Past): ${this.getRelativeTime(pastDate)}`);
            results.push(`Relative Time (Future): ${this.getRelativeTime(futureDate)}`);
            results.push(`Is Weekend: ${this.isWeekend(currentDate) ? 'Yes' : 'No'}`);
            
            const execTime = performance.now() - startTime;
            results.push(`⏱️ Execution Time: ${execTime.toFixed(3)}ms`);
            
            output.innerHTML = results.join('<br>');
            this.updatePerformanceMetrics(execTime);
            
        } catch (error) {
            output.innerHTML = `❌ Error: ${error.message}`;
        }
    }

    // Number Utils Testing
    testNumberUtils() {
        const output = document.getElementById('utils-output');
        const startTime = performance.now();
        
        try {
            const testNumbers = [1, 2, 3, 4, 5, 10, 15, 20];
            const randomNum = Math.random() * 100;
            
            const results = [];
            results.push(`🔢 Number Utils Testing:`);
            results.push(`Test Array: [${testNumbers.join(', ')}]`);
            results.push(`Sum: ${this.sum(testNumbers)}`);
            results.push(`Average: ${this.average(testNumbers).toFixed(2)}`);
            results.push(`Max: ${this.max(testNumbers)}`);
            results.push(`Min: ${this.min(testNumbers)}`);
            results.push(`Random Number: ${randomNum.toFixed(2)}`);
            results.push(`Rounded: ${this.roundTo(randomNum, 1)}`);
            
            const execTime = performance.now() - startTime;
            results.push(`⏱️ Execution Time: ${execTime.toFixed(3)}ms`);
            
            output.innerHTML = results.join('<br>');
            this.updatePerformanceMetrics(execTime);
            
        } catch (error) {
            output.innerHTML = `❌ Error: ${error.message}`;
        }
    }

    // React Hooks Testing
    testReactHooks() {
        const output = document.getElementById('react-output');
        const startTime = performance.now();
        
        try {
            const results = [];
            results.push(`⚛️ React Hooks Simulation:`);
            results.push(`🪟 Window Size Hook: ${this.getWindowSize()}`);
            results.push(`📱 Device Type: ${this.getDeviceType()}`);
            results.push(`🎯 useEffect Simulation: Component mounted`);
            results.push(`🔄 useState Simulation: State updated`);
            
            const execTime = performance.now() - startTime;
            results.push(`⏱️ Hook Performance: ${execTime.toFixed(3)}ms`);
            
            output.innerHTML = results.join('<br>');
            this.updatePerformanceMetrics(execTime);
            
        } catch (error) {
            output.innerHTML = `❌ Error: ${error.message}`;
        }
    }

    // LocalStorage Testing
    testLocalStorage() {
        const output = document.getElementById('react-output');
        const startTime = performance.now();
        
        try {
            const testKey = 'supportjs-demo-test';
            const testValue = { 
                timestamp: new Date().toISOString(), 
                value: Math.random(),
                user: 'demo-user'
            };
            
            // Set item
            localStorage.setItem(testKey, JSON.stringify(testValue));
            
            // Get item
            const retrieved = JSON.parse(localStorage.getItem(testKey));
            
            const results = [];
            results.push(`💾 LocalStorage Testing:`);
            results.push(`✅ Set Item: Success`);
            results.push(`✅ Get Item: Success`);
            results.push(`📝 Stored Data: ${JSON.stringify(retrieved, null, 2).replace(/\n/g, '<br>&nbsp;&nbsp;')}`);
            results.push(`🗄️ Storage Size: ${this.getStorageSize()} bytes`);
            
            const execTime = performance.now() - startTime;
            results.push(`⏱️ Storage Performance: ${execTime.toFixed(3)}ms`);
            
            // Cleanup
            localStorage.removeItem(testKey);
            
            output.innerHTML = results.join('<br>');
            this.updatePerformanceMetrics(execTime);
            
        } catch (error) {
            output.innerHTML = `❌ Error: ${error.message}`;
        }
    }

    // Angular Services Testing
    testLogger() {
        const output = document.getElementById('angular-output');
        const startTime = performance.now();
        
        try {
            const results = [];
            
            // Simulate logger service
            const logLevels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
            const testLogs = [
                { level: 'INFO', message: 'Application started successfully', timestamp: new Date() },
                { level: 'WARN', message: 'Performance warning detected', timestamp: new Date() },
                { level: 'ERROR', message: 'Network request failed', timestamp: new Date() }
            ];
            
            results.push(`📝 Logger Service Active: ✅`);
            results.push(`🔧 Log Levels: ${logLevels.join(', ')}`);
            
            testLogs.forEach((log, index) => {
                results.push(`${index + 1}. [${log.level}] ${log.message}`);
            });
            
            const execTime = performance.now() - startTime;
            results.push(`⏱️ Logger Performance: ${execTime.toFixed(3)}ms`);
            
            output.innerHTML = results.join('<br>');
            this.updatePerformanceMetrics(execTime);
            
        } catch (error) {
            output.innerHTML = `❌ Error: ${error.message}`;
        }
    }

    // HTTP Interceptor Testing
    testHttpInterceptor() {
        const output = document.getElementById('angular-output');
        const startTime = performance.now();
        
        try {
            const results = [];
            results.push(`🌐 HTTP Interceptor Testing:`);
            results.push(`📡 Simulating HTTP requests...`);
            
            // Simulate various HTTP scenarios
            const requests = [
                { url: '/api/users', status: 200, time: '45ms' },
                { url: '/api/posts', status: 200, time: '67ms' },
                { url: '/api/invalid', status: 404, time: '23ms' },
                { url: '/api/server-error', status: 500, time: '120ms' }
            ];
            
            requests.forEach((req, index) => {
                const statusEmoji = req.status === 200 ? '✅' : '❌';
                results.push(`${index + 1}. ${statusEmoji} ${req.url} - ${req.status} (${req.time})`);
            });
            
            const execTime = performance.now() - startTime;
            results.push(`⏱️ Interceptor Performance: ${execTime.toFixed(3)}ms`);
            
            output.innerHTML = results.join('<br>');
            this.updatePerformanceMetrics(execTime);
            
        } catch (error) {
            output.innerHTML = `❌ Error: ${error.message}`;
        }
    }

    // Performance Testing
    runPerformanceTest() {
        const output = document.getElementById('performance-output');
        const progressBar = document.getElementById('performance-progress');
        
        output.innerHTML = '🔄 Running comprehensive performance tests...';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                this.completePerformanceTest();
            }
        }, 200);
    }

    completePerformanceTest() {
        const output = document.getElementById('performance-output');
        const startTime = performance.now();
        
        try {
            // Run all tests
            const tests = [
                () => this.benchmarkStringOperations(),
                () => this.benchmarkArrayOperations(),
                () => this.benchmarkDOMOperations(),
                () => this.benchmarkStorageOperations()
            ];
            
            const results = [];
            results.push(`🚀 Performance Test Results:`);
            
            tests.forEach((test, index) => {
                const testStart = performance.now();
                test();
                const testTime = performance.now() - testStart;
                results.push(`Test ${index + 1}: ${testTime.toFixed(3)}ms`);
            });
            
            const totalTime = performance.now() - startTime;
            results.push(`📊 Total Test Time: ${totalTime.toFixed(3)}ms`);
            results.push(`💾 Memory Usage: ${this.getCurrentMemoryUsage()}MB`);
            results.push(`⚡ Operations/Second: ${(1000 / (totalTime / tests.length)).toFixed(0)}`);
            
            output.innerHTML = results.join('<br>');
            this.updatePerformanceMetrics(totalTime);
            
        } catch (error) {
            output.innerHTML = `❌ Performance Test Error: ${error.message}`;
        }
    }

    // Utility Functions (Mock implementations)
    toCamelCase(str) {
        return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }

    capitalizeString(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    truncateString(str, length) {
        return str.length > length ? str.substring(0, length) + '...' : str;
    }

    reverseString(str) {
        return str.split('').reverse().join('');
    }

    formatDate(date, format) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }

    getRelativeTime(date) {
        const now = new Date();
        const diff = Math.abs(now - date);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }

    isWeekend(date) {
        const day = date.getDay();
        return day === 0 || day === 6;
    }

    sum(arr) {
        return arr.reduce((acc, val) => acc + val, 0);
    }

    average(arr) {
        return this.sum(arr) / arr.length;
    }

    max(arr) {
        return Math.max(...arr);
    }

    min(arr) {
        return Math.min(...arr);
    }

    roundTo(num, decimals) {
        return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }

    getWindowSize() {
        return `${window.innerWidth} × ${window.innerHeight}px`;
    }

    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'Mobile';
        if (width < 1024) return 'Tablet';
        return 'Desktop';
    }

    getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    }

    getCurrentMemoryUsage() {
        if (performance.memory) {
            return (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
        }
        return '~2.1';
    }

    // Benchmark functions
    benchmarkStringOperations() {
        for (let i = 0; i < 1000; i++) {
            this.toCamelCase('test-string-conversion');
            this.reverseString('benchmark-test');
        }
    }

    benchmarkArrayOperations() {
        const arr = Array.from({length: 1000}, (_, i) => i);
        for (let i = 0; i < 100; i++) {
            this.sum(arr);
            this.average(arr);
            this.max(arr);
            this.min(arr);
        }
    }

    benchmarkDOMOperations() {
        for (let i = 0; i < 100; i++) {
            const div = document.createElement('div');
            div.textContent = `Test ${i}`;
            document.body.appendChild(div);
            document.body.removeChild(div);
        }
    }

    benchmarkStorageOperations() {
        for (let i = 0; i < 100; i++) {
            localStorage.setItem(`test${i}`, `value${i}`);
            localStorage.getItem(`test${i}`);
            localStorage.removeItem(`test${i}`);
        }
    }

    updatePerformanceMetrics(executionTime) {
        this.performanceMetrics.totalTests++;
        this.performanceMetrics.averageExecutionTime = 
            ((this.performanceMetrics.averageExecutionTime * (this.performanceMetrics.totalTests - 1)) + executionTime) / this.performanceMetrics.totalTests;
        
        document.getElementById('exec-speed').textContent = `${this.performanceMetrics.averageExecutionTime.toFixed(3)}ms average`;
    }
}

// Global functions for button events
let demo;

// Initialize demo when page loads
document.addEventListener('DOMContentLoaded', function() {
    demo = new SupportJSDemo();
});

// Global functions for HTML buttons
function testStringUtils() {
    demo.testStringUtils();
}

function testDateUtils() {
    demo.testDateUtils();
}

function testNumberUtils() {
    demo.testNumberUtils();
}

function testReactHooks() {
    demo.testReactHooks();
}

function testLocalStorage() {
    demo.testLocalStorage();
}

function testLogger() {
    demo.testLogger();
}

function testHttpInterceptor() {
    demo.testHttpInterceptor();
}

function runPerformanceTest() {
    demo.runPerformanceTest();
}
