// Admin access route
export const ADMIN_PATH = '/admin';

// Check if current path is admin
export const isAdminPath = () => {
  const path = window.location.pathname;
  return path === ADMIN_PATH || path.startsWith(`${ADMIN_PATH}/`);
};

// Navigate to admin
export const navigateToAdmin = () => {
  window.history.pushState({}, '', ADMIN_PATH);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

// Navigate to home
export const navigateToHome = () => {
  window.history.pushState({}, '', '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
};