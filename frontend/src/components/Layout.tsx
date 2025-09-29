// src/components/Layout.tsx

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AuthNavbar from './AuthNavbar'; // New Auth Navbar
import Footer from './Footer';
import { useAuth } from '@/context/AuthContext'; // Use auth context

const Layout = () => {
  const { user } = useAuth();
  
  // Decide which Navbar to show
  const CurrentNavbar = user ? Navbar : AuthNavbar;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CurrentNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;