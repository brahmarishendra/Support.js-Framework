import React, { ButtonHTMLAttributes } from 'react';

export interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
}

/**
 * A customizable button component
 */
export const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  style = {},
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    border: 'none',
    borderRadius: '6px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease-in-out',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    ...style
  };

  const variantStyles: { [key: string]: React.CSSProperties } = {
    primary: {
      backgroundColor: '#007bff',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0, 123, 255, 0.2)'
    },
    secondary: {
      backgroundColor: '#6c757d',
      color: 'white',
      boxShadow: '0 2px 4px rgba(108, 117, 125, 0.2)'
    },
    danger: {
      backgroundColor: '#dc3545',
      color: 'white',
      boxShadow: '0 2px 4px rgba(220, 53, 69, 0.2)'
    },
    success: {
      backgroundColor: '#28a745',
      color: 'white',
      boxShadow: '0 2px 4px rgba(40, 167, 69, 0.2)'
    },
    warning: {
      backgroundColor: '#ffc107',
      color: '#212529',
      boxShadow: '0 2px 4px rgba(255, 193, 7, 0.2)'
    }
  };

  const sizeStyles: { [key: string]: React.CSSProperties } = {
    small: {
      padding: '6px 12px',
      fontSize: '12px',
      minHeight: '32px'
    },
    medium: {
      padding: '8px 16px',
      fontSize: '14px',
      minHeight: '40px'
    },
    large: {
      padding: '12px 24px',
      fontSize: '16px',
      minHeight: '48px'
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size]
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <button
      {...props}
      className={`custom-button ${className}`}
      style={combinedStyles}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
      )}
      {children}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </button>
  );
};

export default CustomButton;
