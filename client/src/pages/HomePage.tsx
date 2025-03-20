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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-black/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <i className="fas fa-satellite text-blue-500 text-2xl mr-2"></i>
                <span className="font-bold text-xl">SatelSys</span>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <a href="#home" className="text-white hover:text-blue-500 px-3 py-2 rounded-md font-medium">Home</a>
                  <a href="#about" className="text-gray-400 hover:text-blue-500 px-3 py-2 rounded-md font-medium">About</a>
                  <a href="#departments" className="text-gray-400 hover:text-blue-500 px-3 py-2 rounded-md font-medium">Departments</a>
                  <a href="#join" className="text-gray-400 hover:text-blue-500 px-3 py-2 rounded-md font-medium">Join Us</a>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/admin" className="text-gray-400 hover:text-blue-500 px-3 py-2 rounded-md font-medium">
                Admin
              </Link>
              <Button 
                onClick={() => setLocation('/departments')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Join Our Team
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="order-2 lg:order-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Explore the Future with <span className="text-blue-500">SatelSys</span>
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-2xl">
                Join our team of innovators as we push the boundaries of satellite technology and explore the infinite possibilities of space.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button 
                  onClick={() => setLocation('/departments')}
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-6 h-auto"
                >
                  Explore Departments
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/apply')}
                  className="border-blue-500 text-blue-500 hover:bg-blue-500/10 text-lg px-6 py-6 h-auto"
                >
                  Join Our Team
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="order-1 lg:order-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <InteractiveSatellite departments={departments} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">About SatelSys</h2>
            <div className="mt-2 h-1 w-20 bg-blue-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {isEditing ? (
                <AboutUsEditor 
                  content={aboutUs?.content || "At SatelSys, we're pioneering the next generation of satellite technology. Our mission is to connect the world, monitor our planet, and explore the cosmos with cutting-edge satellite systems."}
                  onSave={handleSaveAbout}
                />
              ) : (
                <p className="text-lg text-gray-300">
                  {aboutUs?.content || "At SatelSys, we're pioneering the next generation of satellite technology. Our mission is to connect the world, monitor our planet, and explore the cosmos with cutting-edge satellite systems."}
                </p>
              )}
              <p className="text-lg text-gray-300">
                Founded in 2020, our team of experts has quickly established SatelSys as a leader in satellite innovation. We combine expertise in engineering, communications, data science, and more to create comprehensive satellite solutions.
              </p>
              <p className="text-lg text-gray-300">
                Our satellites provide critical data for climate research, telecommunications, navigation, and space exploration. We're committed to developing technology that makes a positive impact on humanity and our understanding of the universe.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/60 rounded-lg p-6 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                <div className="text-blue-500 text-3xl mb-4">
                  <i className="fas fa-satellite"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">Advanced Technology</h3>
                <p className="text-gray-400">Cutting-edge satellite designs with the latest innovations in space technology.</p>
              </div>
              
              <div className="bg-gray-900/60 rounded-lg p-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                <div className="text-purple-500 text-3xl mb-4">
                  <i className="fas fa-users"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">Expert Team</h3>
                <p className="text-gray-400">World-class engineers, scientists, and professionals dedicated to excellence.</p>
              </div>
              
              <div className="bg-gray-900/60 rounded-lg p-6 shadow-lg hover:shadow-teal-500/20 transition-all duration-300">
                <div className="text-teal-500 text-3xl mb-4">
                  <i className="fas fa-globe-americas"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">Global Impact</h3>
                <p className="text-gray-400">Creating solutions that address critical challenges facing our planet.</p>
              </div>
              
              <div className="bg-gray-900/60 rounded-lg p-6 shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
                <div className="text-orange-500 text-3xl mb-4">
                  <i className="fas fa-rocket"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation Focus</h3>
                <p className="text-gray-400">Constantly pushing boundaries to explore new frontiers in satellite systems.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Our Departments</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Explore the different teams that make our satellite systems possible and find where your skills fit best.
            </p>
            <div className="mt-2 h-1 w-20 bg-blue-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <motion.div 
                key={dept.id}
                className="bg-gray-900/60 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-blue-500/30 hover:translate-y-[-5px] group"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`https://source.unsplash.com/random/800x600/?satellite,${dept.name.toLowerCase()}`}
                    alt={dept.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: `${dept.color}33` }}
                    >
                      <i className={`fas fa-${dept.icon}`} style={{ color: dept.color }}></i>
                    </div>
                    <h3 className="text-xl font-bold">{dept.name}</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    {dept.description}
                  </p>
                  <div className="mt-2 space-y-2">
                    {dept.requirements.slice(0, 3).map((req, index) => (
                      <div key={index} className="flex items-start">
                        <i className="fas fa-check-circle text-sm mt-1 mr-2" style={{ color: dept.color }}></i>
                        <span className="text-gray-400">{req}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button
                      asChild
                      className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white bg-transparent"
                      style={{ 
                        borderColor: dept.color, 
                        color: dept.color,
                      }}
                    >
                      <Link href={`/departments/${dept.id}`}>
                        Learn More
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              asChild 
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              <Link href="/apply">
                Apply Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <i className="fas fa-satellite text-blue-500 text-2xl mr-2"></i>
                <span className="font-bold text-xl">SatelSys</span>
              </div>
              <p className="text-gray-400 mb-4">
                Pioneering the next generation of satellite technology for a connected world.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <i className="fab fa-github"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-blue-500 transition-colors">About Us</a></li>
                <li><a href="#departments" className="text-gray-400 hover:text-blue-500 transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">News</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Departments</h4>
              <ul className="space-y-2">
                {departments.map(dept => (
                  <li key={dept.id}>
                    <Link 
                      href={`/departments/${dept.id}`}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      {dept.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt text-blue-500 mt-1 mr-2"></i>
                  <span className="text-gray-400">123 Space Avenue, NIT Agartala</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-envelope text-blue-500 mt-1 mr-2"></i>
                  <span className="text-gray-400">contact@satelsys.com</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-phone text-blue-500 mt-1 mr-2"></i>
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-center">
              &copy; 2025 SatelSys. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
