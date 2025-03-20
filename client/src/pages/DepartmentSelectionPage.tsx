import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { defaultDepartments } from '@/lib/departmentDetails';
import type { Department } from '@/types';

export default function DepartmentSelectionPage() {
  const [location] = useLocation();
  
  // Fetch departments
  const { data: departments = defaultDepartments, isLoading } = useQuery<Department[]>({
    queryKey: ['/api/departments'],
  });

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Select a Department</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the department that aligns with your skills and interests to begin your application.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-blue-500/50 transition-colors overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-4">
                      <div className="h-40 md:h-auto overflow-hidden relative">
                        <div 
                          className="absolute inset-0 z-10"
                          style={{ 
                            background: `linear-gradient(to right, ${dept.color}99, transparent)` 
                          }}
                        ></div>
                        <img 
                          src={`https://source.unsplash.com/random/400x300/?satellite,${dept.name.toLowerCase()}`}
                          alt={dept.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div className="col-span-3 p-6">
                        <div className="flex items-center mb-4">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                            style={{ backgroundColor: `${dept.color}33` }}
                          >
                            <i className={`fas fa-${dept.icon}`} style={{ color: dept.color }}></i>
                          </div>
                          <h2 className="text-xl font-bold">{dept.name}</h2>
                        </div>
                        
                        <p className="text-gray-300 mb-6">
                          {dept.description}
                        </p>
                        
                        <Separator className="my-4 bg-gray-800" />
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {dept.requirements.slice(0, 3).map((req, i) => (
                            <div 
                              key={i} 
                              className="px-3 py-1 rounded-full text-sm"
                              style={{ 
                                backgroundColor: `${dept.color}20`,
                                color: dept.color
                              }}
                            >
                              {req}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button 
                            asChild
                            style={{ 
                              backgroundColor: dept.color,
                              color: 'white'
                            }}
                          >
                            <Link href={`/apply/${dept.id}`}>
                              Apply Now
                            </Link>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            asChild
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <Link href={`/departments/${dept.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
