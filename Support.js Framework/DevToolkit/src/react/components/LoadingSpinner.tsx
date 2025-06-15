import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A customizable loading spinner component
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#007bff',
  className = '',
  style = {}
}) => {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32
  };

  const spinnerSize = sizeMap[size];

  const spinnerStyles: React.CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    ...style
  };

  return (
    <div className={`loading-spinner ${className}`} style={spinnerStyles}>
      <svg
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animation: 'spin 1s linear infinite' }}
      >
        <path d="M21 12a9 9 0 11-6.219-8.56" />
      </svg>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
};

export default LoadingSpinner;
