import { useEffect } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { defaultDepartments, getDepartmentById } from '@/lib/departmentDetails';
import DepartmentDetails from '@/components/DepartmentDetails';
import type { Department, RouteParams } from '@/types';

export default function DepartmentDetailsPage() {
  const [location] = useLocation();
  const params = useParams<RouteParams>();
  const departmentId = params.departmentId ? parseInt(params.departmentId) : undefined;
  
  // Fetch all departments
  const { data: departments = defaultDepartments, isLoading: isLoadingAll } = useQuery<Department[]>({
    queryKey: ['/api/departments'],
  });

  // Fetch specific department if ID is provided
  const { data: department, isLoading: isLoadingSingle } = useQuery<Department>({
    queryKey: [`/api/departments/${departmentId}`],
    enabled: !!departmentId,
  });

  // Get current department (either from single query or from all departments)
  const currentDepartment = department || (departmentId ? getDepartmentById(departmentId, departments) : undefined);
  const isLoading = isLoadingAll || isLoadingSingle;

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (!departmentId) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Department</h1>
          <p className="text-gray-400 mb-6">No department ID was specified.</p>
          <Button asChild>
            <Link href="/departments">Browse Departments</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/departments">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <i className="fas fa-arrow-left mr-2"></i> All Departments
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : currentDepartment ? (
          <DepartmentDetails department={currentDepartment} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800"
          >
            <h2 className="text-2xl font-bold mb-4">Department Not Found</h2>
            <p className="text-gray-400 mb-6">The department you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/departments">Browse All Departments</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
