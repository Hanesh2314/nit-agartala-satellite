import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { defaultDepartments, getDepartmentById } from '@/lib/departmentDetails';
import { Link } from 'wouter';
import type { Department, ApplicantFormData, RouteParams } from '@/types';

export default function ApplicationFormPage() {
  const [location, navigate] = useLocation();
  const params = useParams<RouteParams>();
  const { toast } = useToast();
  const departmentId = params.departmentId ? parseInt(params.departmentId) : undefined;
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>(departmentId);
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch departments
  const { data: departments = defaultDepartments } = useQuery<Department[]>({
    queryKey: ['/api/departments'],
  });

  // Get current department
  const currentDepartment = selectedDepartmentId
    ? getDepartmentById(selectedDepartmentId, departments)
    : undefined;

  // Set selected department when URL param changes
  useEffect(() => {
    if (departmentId) {
      setSelectedDepartmentId(departmentId);
    }
  }, [departmentId]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, or DOCX file",
          variant: "destructive",
        });
        return;
      }
      
      setResume(file);
      setResumeFileName(file.name);
    }
  };

  // Mutation for submitting application
  const submitMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiRequest('POST', '/api/applicants', undefined, {
        method: 'POST',
        body: formData,
        headers: {}, // Don't set Content-Type, browser will set it with boundary
        credentials: 'include',
      });
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Your application has been received successfully.",
        variant: "success",
      });
      
      // Navigate to confirmation page
      navigate("/confirmation");
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email format";
    if (!selectedDepartmentId) errors.department = "Please select a department";
    if (!experience) errors.experience = "Please select your experience level";
    if (!skills.trim()) errors.skills = "Please list your key skills";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    if (phone) formData.append('phone', phone);
    formData.append('departmentId', selectedDepartmentId!.toString());
    formData.append('experience', experience);
    formData.append('skills', skills);
    if (coverLetter) formData.append('coverLetter', coverLetter);
    if (resume) formData.append('resume', resume);
    
    submitMutation.mutate(formData);
  };

  // Get color for the current department
  const getDepartmentColor = (): string => {
    return currentDepartment?.color || '#4D9DE0';
  };

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/departments">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <i className="fas fa-arrow-left mr-2"></i> Back to Departments
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ready to be part of the future of satellite technology? Complete the application form below to get started.
          </p>
        </motion.div>

        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Department Selection */}
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-4 text-white">Select Department</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <RadioGroup value={selectedDepartmentId?.toString()} onValueChange={(value) => setSelectedDepartmentId(parseInt(value))}>
                    {departments.map((dept) => (
                      <div key={dept.id} className="relative">
                        <RadioGroupItem 
                          value={dept.id.toString()} 
                          id={`dept-${dept.id}`} 
                          className="peer absolute opacity-0 w-full h-full cursor-pointer z-10" 
                        />
                        <Label 
                          htmlFor={`dept-${dept.id}`} 
                          className="block p-4 bg-gray-800/50 border border-gray-700 rounded-lg peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 transition-all cursor-pointer"
                          style={{
                            borderColor: selectedDepartmentId === dept.id ? dept.color : 'rgba(55, 65, 81, 1)',
                            backgroundColor: selectedDepartmentId === dept.id ? `${dept.color}1A` : 'rgba(31, 41, 55, 0.5)'
                          }}
                        >
                          <div className="flex flex-col items-center text-center">
                            <i className={`fas fa-${dept.icon} text-2xl mb-2`} style={{ color: dept.color }}></i>
                            <span className="font-medium">{dept.name}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                {formErrors.department && (
                  <p className="text-red-500 mt-2 text-sm">{formErrors.department}</p>
                )}
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-medium mb-4 text-white">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-name" className="text-sm font-medium text-gray-300">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-gray-800/50 border-gray-700"
                      placeholder="Enter your first name"
                      required
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-sm">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last-name" className="text-sm font-medium text-gray-300">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-gray-800/50 border-gray-700"
                      placeholder="Enter your last name"
                      required
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-sm">{formErrors.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800/50 border-gray-700"
                      placeholder="you@example.com"
                      required
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-300">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-gray-800/50 border-gray-700"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-xl font-medium mb-4 text-white">Professional Information</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium text-gray-300">
                      Years of Experience <span className="text-red-500">*</span>
                    </Label>
                    <Select value={experience} onValueChange={setExperience}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700">
                        <SelectValue placeholder="Select years of experience" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="0-1">Less than 1 year</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.experience && (
                      <p className="text-red-500 text-sm">{formErrors.experience}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-sm font-medium text-gray-300">
                      Key Skills <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="skills"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="bg-gray-800/50 border-gray-700"
                      placeholder="e.g., Python, RF Engineering, Spacecraft Design"
                      required
                    />
                    {formErrors.skills && (
                      <p className="text-red-500 text-sm">{formErrors.skills}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume" className="text-sm font-medium text-gray-300">
                      Upload Resume
                    </Label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md hover:border-blue-500 transition-colors"
                         style={{ borderColor: resume ? getDepartmentColor() : 'rgba(55, 65, 81, 0.5)' }}>
                      <div className="space-y-1 text-center">
                        <i className="fas fa-file-upload text-gray-400 text-3xl"></i>
                        <div className="flex text-sm text-gray-400">
                          <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400"
                                 style={{ color: getDepartmentColor() }}>
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="resume"
                              type="file"
                              onChange={handleFileChange}
                              className="sr-only"
                              accept=".pdf,.doc,.docx"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
                      </div>
                    </div>
                    {resumeFileName && (
                      <p className="mt-2 text-sm text-gray-400">
                        Selected file: {resumeFileName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover-letter" className="text-sm font-medium text-gray-300">
                      Cover Letter
                    </Label>
                    <Textarea
                      id="cover-letter"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={4}
                      className="bg-gray-800/50 border-gray-700 resize-none"
                      placeholder="Tell us why you're interested in joining our team..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  className="w-full py-6 text-lg font-medium"
                  style={{ backgroundColor: getDepartmentColor() }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
