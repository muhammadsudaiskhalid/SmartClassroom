import React from 'react';
import Navbar from '../shared/Navbar';

const MainLayout = React.memo(({ user, onLogout, onEditProfile, children }) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} onLogout={onLogout} onEditProfile={onEditProfile} />
      <main className="pb-12" role="main">
        {children}
      </main>
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;