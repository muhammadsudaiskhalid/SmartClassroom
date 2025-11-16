import React from 'react';

const LoadingSpinner = React.memo(({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`${sizes[size]} border-orange-200 border-t-orange-500 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export const LoadingPage = React.memo(({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-neutral-600 text-lg" role="status">{message}</p>
    </div>
  );
});

LoadingPage.displayName = 'LoadingPage';

export default LoadingSpinner;