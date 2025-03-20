import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { defaultDepartments } from '@/lib/departmentDetails';
import type { Applicant, AboutUs, Department } from '@/types';
import AboutUsEditor from './AboutUsEditor';
import ApplicantDetailsModal from './ApplicantDetailsModal';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch applicants
  const { data: applicants, isLoading } = useQuery<Applicant[]>({
    queryKey: ['/api/admin/applicants'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch departments
  const { data: departments = defaultDepartments } = useQuery<Department[]>({
    queryKey: ['/api/departments'],
  });

  // Fetch about us content
  const { data: aboutUs } = useQuery<AboutUs>({
    queryKey: ['/api/about'],
  });

  // Delete applicant mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/admin/applicants/${id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Applicant deleted successfully',
        variant: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/applicants'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete applicant: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update about us content mutation
  const updateAboutMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('PUT', '/api/admin/about', { content });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'About Us content updated successfully',
        variant: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/about'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update About Us content: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleDeleteApplicant = (id: number) => {
    if (window.confirm('Are you sure you want to delete this applicant?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const handleSaveAboutUs = (content: string) => {
    updateAboutMutation.mutate(content);
  };

  return (
    <div className="w-full bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800">
      <div className="border-b border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Admin Dashboard</h3>
          <Button variant="ghost" onClick={onLogout} className="text-gray-400 hover:text-white">
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </Button>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="applicants">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="applicants">Applicant Data</TabsTrigger>
            <TabsTrigger value="about">Edit About Section</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applicants" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : applicants && applicants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {applicants.map((applicant) => (
                      <tr key={applicant.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {applicant.firstName} {applicant.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {departments.find((d: Department) => d.id === applicant.departmentId)?.name || `Department ${applicant.departmentId}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {applicant.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {applicant.experience}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleViewApplicant(applicant)}
                            className="text-blue-500 hover:text-blue-400 h-8 px-2"
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                          <Button 
                            variant="ghost" 
                            onClick={() => handleDeleteApplicant(applicant.id)}
                            className="text-red-500 hover:text-red-400 h-8 px-2"
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No applicants found. When people apply, they will appear here.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="about">
            <AboutUsEditor
              content={aboutUs?.content || "At NIT Agartala's RESEARCH SATELLITE project, we're pioneering the next generation of satellite technology. Our mission is to design and build a research satellite with teams specializing in Power Systems, On-Board Computing, Communication Systems, and Attitude Control."}
              onSave={handleSaveAboutUs}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Applicant Details Modal */}
      {selectedApplicant && (
        <ApplicantDetailsModal
          applicant={selectedApplicant}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
