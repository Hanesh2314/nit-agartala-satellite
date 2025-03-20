import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import type { Department } from '@/types';

interface DepartmentDetailsProps {
  department: Department;
}

export default function DepartmentDetails({ department }: DepartmentDetailsProps) {
  const getIcon = (iconName: string) => {
    return `fas fa-${iconName}`;
  };

  const getBgColors = (color: string) => {
    return {
      bgLight: `${color}20`, // 12.5% opacity
      bgMedium: `${color}30`, // 19% opacity
      borderColor: `${color}50` // 31% opacity
    };
  };

  const { bgLight, bgMedium, borderColor } = getBgColors(department.color);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-800"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-center mb-6">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
            style={{ backgroundColor: bgMedium, borderColor }}
          >
            <i className={`${getIcon(department.icon)} text-xl`} style={{ color: department.color }}></i>
          </div>
          <h2 className="text-2xl font-bold text-white">{department.name}</h2>
        </div>
        
        <p className="text-gray-300 mb-8">
          {department.description}
        </p>
        
        <div className="grid gap-8 sm:grid-cols-2">
          <div 
            className="rounded-lg p-5"
            style={{ backgroundColor: bgLight, borderColor }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <i className="fas fa-clipboard-list mr-2" style={{ color: department.color }}></i>
              Requirements
            </h3>
            <ul className="space-y-2">
              {department.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <i className="fas fa-check-circle text-sm mt-1 mr-2" style={{ color: department.color }}></i>
                  <span className="text-gray-300">{req}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div 
            className="rounded-lg p-5"
            style={{ backgroundColor: bgLight, borderColor }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <i className="fas fa-tasks mr-2" style={{ color: department.color }}></i>
              Responsibilities
            </h3>
            <ul className="space-y-2">
              {department.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start">
                  <i className="fas fa-check-circle text-sm mt-1 mr-2" style={{ color: department.color }}></i>
                  <span className="text-gray-300">{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            className="w-full sm:w-auto"
            style={{ backgroundColor: department.color, color: 'white' }}
          >
            <Link href={`/apply/${department.id}`}>
              Apply Now
            </Link>
          </Button>
          
          <Button
            variant="outline"
            asChild
            className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <Link href="/departments">
              Back to Departments
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
