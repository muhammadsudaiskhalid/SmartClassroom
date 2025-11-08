import React from 'react';
import Navbar from '../shared/Navbar';

const MainLayout = ({ user, onLogout, onEditProfile, children }) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} onLogout={onLogout} onEditProfile={onEditProfile} />
      <main className="pb-12">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;