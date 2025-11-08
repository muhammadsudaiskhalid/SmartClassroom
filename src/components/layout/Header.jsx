import React from 'react';

const Header = ({ title, subtitle, action }) => {
  return (
    <div className="bg-white border-b border-neutral-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-neutral-600">{subtitle}</p>
            )}
          </div>
          {action && (
            <div>{action}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;