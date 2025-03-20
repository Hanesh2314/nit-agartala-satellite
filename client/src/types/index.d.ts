// Department types
export type Department = {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirements: string[];
  responsibilities: string[];
};

// Applicant types
export type Applicant = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId: number;
  experience: string;
  skills: string;
  coverLetter?: string;
  resumePath?: string;
  createdAt: string;
};

export type ApplicantFormData = Omit<Applicant, 'id' | 'createdAt' | 'resumePath'> & {
  resume?: File;
};

// Admin panel types
export type AdminLoginProps = {
  onLogin: (success: boolean) => void;
};

export type AdminDashboardProps = {
  onLogout: () => void;
};

// About Us types
export type AboutUs = {
  id: number;
  content: string;
  updatedAt: string;
};

export type AboutUsEditorProps = {
  content: string;
  onSave: (content: string) => void;
};

// Satellite model and interaction types
export type SatellitePart = {
  name: string;
  description: string;
  position: [number, number, number];
  departmentId: number;
  color: string;
};

// Form types
export type RouteParams = {
  departmentId?: string;
  [key: string]: string | undefined;
};
