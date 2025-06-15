import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import {
  SSRStorage,
  formatSEODate,
  generateMetaTags,
  getQueryParam,
  createNextLogger,
  getConfig,
  APIHelpers,
  optimizeImageUrl
} from 'support-js-framework/nextjs';

import {
  formatDate,
  formatCurrency,
  isEmail,
  hexToRgb,
  createLogger
} from 'support-js-framework/core';

// Types
interface PageProps {
  serverTime: string;
  userAgent: string;
  isServer: boolean;
  config: {
    isDevelopment: boolean;
    isProduction: boolean;
    baseUrl: string;
  };
  initialData: {
    stats: {
      totalUsers: number;
      totalRevenue: number;
      conversionRate: number;
    };
    recentActivity: Array<{
      id: string;
      type: 'user_signup' | 'purchase' | 'feature_use';
      description: string;
      timestamp: string;
      value?: number;
    }>;
  };
}

interface MetricsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
}

// Initialize logger
const logger = createNextLogger('HomePage');

// Components
const SEOHead: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const metaTags = generateMetaTags({
    title,
    description,
    keywords: ['support-js', 'framework', 'nextjs', 'utilities', 'typescript'],
    image: '/api/og-image',
    url: 'https://support-js-framework.dev',
    type: 'website'
  });

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {Object.entries(metaTags).map(([key, value]) => {
        if (key === 'canonical') {
          return <link key={key} rel="canonical" href={value} />;
        }
        return <meta key={key} name={key} property={key} content={value} />;
      })}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

const ServerInfo: React.FC<{ serverTime: string; userAgent: string; config: any }> = ({ 
  serverTime, 
  userAgent, 
  config 
}) => (
  <div className="demo-section">
    <h2>🖥️ Server-Side Rendering Info</h2>
    <div className="info-grid">
      <div className="info-item">
        <strong>Server Time:</strong>
        <span>{new Date(serverTime).toLocaleString()}</span>
      </div>
      <div className="info-item">
        <strong>Environment:</strong>
        <span>{config.isDevelopment ? 'Development' : 'Production'}</span>
      </div>
      <div className="info-item">
        <strong>Base URL:</strong>
        <span>{config.baseUrl}</span>
      </div>
      <div className="info-item">
        <strong>User Agent:</strong>
        <span className="user-agent">{userAgent}</span>
      </div>
    </div>
  </div>
);

const StatsSection: React.FC<{ stats: PageProps['initialData']['stats'] }> = ({ stats }) => (
  <div className="demo-section">
    <h2>📊 Business Statistics</h2>
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Users</h3>
        <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
      </div>
      <div className="stat-card">
        <h3>Total Revenue</h3>
        <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
      </div>
      <div className="stat-card">
        <h3>Conversion Rate</h3>
        <div className="stat-value">{(stats.conversionRate * 100).toFixed(1)}%</div>
      </div>
    </div>
  </div>
);

const ActivityFeed: React.FC<{ activities: PageProps['initialData']['recentActivity'] }> = ({ 
  activities 
}) => (
  <div className="demo-section">
    <h2>🔔 Recent Activity</h2>
    <div className="activity-feed">
      {activities.map((activity) => (
        <div key={activity.id} className={`activity-item activity-${activity.type}`}>
          <div className="activity-icon">
            {activity.type === 'user_signup' && '👤'}
            {activity.type === 'purchase' && '💰'}
            {activity.type === 'feature_use' && '⚡'}
          </div>
          <div className="activity-content">
            <p>{activity.description}</p>
            <div className="activity-meta">
              <span className="activity-time">
                {formatDate(new Date(activity.timestamp), 'MMM DD, YYYY HH:mm:ss')}
              </span>
              {activity.value && (
                <span className="activity-value">
                  {formatCurrency(activity.value)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ClientSideSection: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [color, setColor] = useState('#3498db');

  // Load metrics on client side
  const loadMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/metrics');
      const data = await response.json();
      setMetrics(data.data);
      logger.info('Metrics loaded successfully', data.data);
    } catch (error) {
      logger.error('Failed to load metrics', error);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to newsletter
  const handleSubscribe = async () => {
    if (!isEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Successfully subscribed!');
        setEmail('');
        logger.info('User subscribed', { email });
      } else {
        alert(result.error || 'Subscription failed');
      }
    } catch (error) {
      logger.error('Subscription error', error);
      alert('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    loadMetrics();
    
    // Store page visit in client-side storage
    const pageVisits = SSRStorage.getLocal('pageVisits', 0);
    SSRStorage.setLocal('pageVisits', pageVisits + 1);
    
    logger.info('Page loaded on client', {
      visits: pageVisits + 1,
      timestamp: new Date().toISOString()
    });
  }, []);

  const rgb = hexToRgb(color);

  return (
    <div className="demo-section">
      <h2>💻 Client-Side Features</h2>
      
      {/* Metrics Section */}
      <div className="client-feature">
        <h3>Real-time Metrics</h3>
        <button 
          onClick={loadMetrics} 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Loading...' : 'Refresh Metrics'}
        </button>
        
        {metrics && (
          <div className="metrics-grid">
            <div className="metric-item">
              <strong>Page Views:</strong> {metrics.pageViews.toLocaleString()}
            </div>
            <div className="metric-item">
              <strong>Unique Visitors:</strong> {metrics.uniqueVisitors.toLocaleString()}
            </div>
            <div className="metric-item">
              <strong>Bounce Rate:</strong> {(metrics.bounceRate * 100).toFixed(1)}%
            </div>
            <div className="metric-item">
              <strong>Avg Session:</strong> {Math.round(metrics.avgSessionDuration)}s
            </div>
          </div>
        )}
      </div>

      {/* Newsletter Subscription */}
      <div className="client-feature">
        <h3>Newsletter Subscription</h3>
        <div className="subscription-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={`form-control ${email ? (isEmail(email) ? 'valid' : 'invalid') : ''}`}
          />
          <button 
            onClick={handleSubscribe}
            className="btn btn-primary"
            disabled={!isEmail(email)}
          >
            Subscribe
          </button>
        </div>
        <div className="validation-feedback">
          {email && (isEmail(email) ? '✓ Valid email' : '✗ Invalid email format')}
        </div>
      </div>

      {/* Color Picker */}
      <div className="client-feature">
        <h3>Color Utilities</h3>
        <div className="color-demo">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-picker"
          />
          <div className="color-info">
            <div className="color-swatch" style={{ backgroundColor: color }} />
            <div className="color-details">
              <p><strong>Hex:</strong> {color}</p>
              {rgb && (
                <p><strong>RGB:</strong> {rgb.r}, {rgb.g}, {rgb.b}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Storage Demo */}
      <div className="client-feature">
        <h3>Client Storage</h3>
        <p>
          Page visits this session: <strong>{SSRStorage.getLocal('pageVisits', 0)}</strong>
        </p>
        <button 
          onClick={() => {
            SSRStorage.setLocal('pageVisits', 0);
            window.location.reload();
          }}
          className="btn btn-secondary"
        >
          Reset Counter
        </button>
      </div>
    </div>
  );
};

const ImageOptimizationSection: React.FC = () => {
  const images = [
    {
      src: '/images/demo-1.jpg',
      alt: 'Demo Image 1',
      width: 300,
      height: 200
    },
    {
      src: '/images/demo-2.jpg',
      alt: 'Demo Image 2',
      width: 300,
      height: 200
    }
  ];

  return (
    <div className="demo-section">
      <h2>🖼️ Image Optimization</h2>
      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <img
              src={optimizeImageUrl({
                src: image.src,
                width: image.width,
                height: image.height,
                quality: 80
              })}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
            />
            <p>Optimized: {image.width}×{image.height}, 80% quality</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Page Component
const HomePage: React.FC<PageProps> = ({ 
  serverTime, 
  userAgent, 
  isServer, 
  config, 
  initialData 
}) => {
  return (
    <>
      <SEOHead
        title="Support.js Framework - Next.js Demo"
        description="Interactive demonstration of Support.js Framework integration with Next.js, featuring SSR, API routes, and client-side utilities."
      />

      <div className="app">
        <header className="app-header">
          <h1>🚀 Support.js Framework - Next.js Demo</h1>
          <p>Server-side rendering, API integration, and client-side utilities</p>
          <div className="render-info">
            Rendered on: <strong>{isServer ? 'Server' : 'Client'}</strong>
          </div>
        </header>

        <main className="app-main">
          <ServerInfo 
            serverTime={serverTime}
            userAgent={userAgent}
            config={config}
          />
          
          <StatsSection stats={initialData.stats} />
          
          <ActivityFeed activities={initialData.recentActivity} />
          
          <ClientSideSection />
          
          <ImageOptimizationSection />
        </main>

        <footer className="app-footer">
          <p>Built with Support.js Framework | Next.js Integration Demo</p>
          <p>Generated at: {formatSEODate(new Date(serverTime))}</p>
        </footer>
      </div>

      <style jsx>{`
        .app {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .app-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 40px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
        }

        .app-header h1 {
          margin: 0 0 10px 0;
          font-size: 2.5rem;
        }

        .render-info {
          margin-top: 20px;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          display: inline-block;
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

        .info-grid, .stats-grid, .metrics-grid {
          display: grid;
          gap: 20px;
          margin-top: 20px;
        }

        .info-grid {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .stats-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }

        .metrics-grid {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .user-agent {
          font-size: 0.9rem;
          color: #666;
          word-break: break-all;
        }

        .stat-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e9ecef;
        }

        .stat-card h3 {
          margin: 0 0 10px 0;
          color: #495057;
          font-size: 1rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #667eea;
        }

        .activity-feed {
          max-height: 400px;
          overflow-y: auto;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 10px;
          background: #f8f9fa;
        }

        .activity-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 50%;
          border: 2px solid #e9ecef;
        }

        .activity-content {
          flex: 1;
        }

        .activity-content p {
          margin: 0 0 8px 0;
          color: #333;
        }

        .activity-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #666;
        }

        .client-feature {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          background: #f8f9fa;
        }

        .client-feature h3 {
          margin: 0 0 15px 0;
          color: #495057;
        }

        .subscription-form {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .form-control {
          flex: 1;
          padding: 10px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-control.valid {
          border-color: #28a745;
        }

        .form-control.invalid {
          border-color: #dc3545;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #667eea;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #5a67d8;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .validation-feedback {
          font-size: 0.9rem;
          margin-top: 5px;
        }

        .color-demo {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .color-picker {
          width: 60px;
          height: 60px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .color-info {
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

        .color-details p {
          margin: 5px 0;
          font-size: 0.9rem;
        }

        .metric-item {
          text-align: center;
          padding: 10px;
          background: white;
          border-radius: 6px;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }

        .image-item {
          text-align: center;
        }

        .image-item img {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
      `}</style>
    </>
  );
};

// Server-Side Props
export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const config = getConfig();
  const logger = createNextLogger('SSR');
  
  try {
    // Simulate data fetching
    const initialData = {
      stats: {
        totalUsers: 15247,
        totalRevenue: 89432.50,
        conversionRate: 0.034
      },
      recentActivity: [
        {
          id: '1',
          type: 'user_signup' as const,
          description: 'New user John Doe signed up',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          type: 'purchase' as const,
          description: 'Purchase completed',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          value: 99.99
        },
        {
          id: '3',
          type: 'feature_use' as const,
          description: 'User activated premium feature',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ]
    };

    logger.info('SSR data prepared', {
      userAgent: context.req.headers['user-agent'],
      timestamp: new Date().toISOString()
    });

    return {
      props: {
        serverTime: new Date().toISOString(),
        userAgent: context.req.headers['user-agent'] || 'Unknown',
        isServer: true,
        config,
        initialData
      }
    };
  } catch (error) {
    logger.error('SSR error', error);
    
    // Return minimal props on error
    return {
      props: {
        serverTime: new Date().toISOString(),
        userAgent: 'Unknown',
        isServer: true,
        config,
        initialData: {
          stats: { totalUsers: 0, totalRevenue: 0, conversionRate: 0 },
          recentActivity: []
        }
      }
    };
  }
};

export default HomePage;
