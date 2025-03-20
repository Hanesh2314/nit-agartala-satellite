import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { defaultDepartments } from '@/lib/departmentDetails';
import InteractiveSatellite from '@/components/InteractiveSatellite';
import AboutUsEditor from '@/components/AboutUsEditor';
import type { Department, AboutUs } from '@/types';

export default function HomePage() {
  const [location, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch departments
  const { data: departments = defaultDepartments } = useQuery<Department[]>({
    queryKey: ['/api/departments'],
  });
  
  // Fetch about us content
  const { data: aboutUs } = useQuery<AboutUs>({
    queryKey: ['/api/about'],
  });
  
  const handleSaveAbout = (content: string) => {
    // In a real app, this would send the content to the server
    console.log("Saved about content:", content);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal Navigation */}
      <nav className="bg-black/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <i className="fas fa-satellite text-blue-500 text-2xl mr-2"></i>
                <span className="font-bold text-xl">RESEARCH SATELLITE</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-400 hover:text-blue-500 px-3 py-2 rounded-md font-medium">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Simple with just the satellite */}
      <section className="flex-grow flex flex-col items-center justify-center pt-16 px-4">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-center">
            <span className="text-blue-500">RESEARCH SATELLITE</span>
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Join our team and help us build the future of satellite technology at NIT Agartala
          </p>
        </motion.div>

        <motion.div 
          className="w-full max-w-4xl my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <InteractiveSatellite departments={departments} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex justify-center"
        >
          <Button 
            onClick={() => setLocation('/departments')}
            className="bg-blue-600 hover:bg-blue-700 text-lg px-10 py-6 h-auto rounded-full"
          >
            Join Our Team
          </Button>
        </motion.div>
      </section>

      {/* About Section - Simple */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-black/40">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold">About Our Project</h2>
            <div className="mt-2 h-1 w-20 bg-blue-500 mx-auto"></div>
          </div>
          
          <div className="space-y-6">
            {isEditing ? (
              <AboutUsEditor 
                content={aboutUs?.content || "The Research Satellite project at NIT Agartala is pioneering the next generation of satellite technology. Our mission is to connect the world, monitor our planet, and explore the cosmos with cutting-edge satellite systems."}
                onSave={handleSaveAbout}
              />
            ) : (
              <p className="text-lg text-gray-300 text-center">
                {aboutUs?.content || "The Research Satellite project at NIT Agartala is pioneering the next generation of satellite technology. Our mission is to connect the world, monitor our planet, and explore the cosmos with cutting-edge satellite systems."}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-black/40 py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <i className="fas fa-satellite text-blue-500 text-xl mr-2"></i>
              <span className="font-bold">RESEARCH SATELLITE</span>
            </div>
            <p className="text-gray-500 text-sm text-center">
              &copy; 2025 NIT Agartala Research Satellite Project. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
