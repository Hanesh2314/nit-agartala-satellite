import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function AdminPanelPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (success: boolean) => {
    setIsLoggedIn(success);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <i className="fas fa-arrow-left mr-2"></i> Back to Home
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Admin Panel</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Secure access for authorized personnel to manage applicants and content.
          </p>
        </motion.div>

        {isLoggedIn ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <AdminLogin onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
}
