import type { Department } from '@/types';

/**
 * Get department icon color based on department name
 */
export function getDepartmentColor(departmentName: string): string {
  switch (departmentName.toLowerCase()) {
    case 'engineering':
      return '#4D9DE0'; // Blue
    case 'communications':
      return '#F46036'; // Orange
    case 'data science':
      return '#7B5EA7'; // Purple
    default:
      return '#3CAEA3'; // Teal (default)
  }
}

/**
 * Get department icon name based on department name
 */
export function getDepartmentIcon(departmentName: string): string {
  switch (departmentName.toLowerCase()) {
    case 'engineering':
      return 'cogs';
    case 'communications':
      return 'satellite-dish';
    case 'data science':
      return 'chart-bar';
    default:
      return 'rocket';
  }
}

/**
 * Get department name by ID
 */
export function getDepartmentNameById(departmentId: number, departments: Department[]): string {
  const department = departments.find(d => d.id === departmentId);
  return department ? department.name : 'Unknown Department';
}

/**
 * Get department by ID
 */
export function getDepartmentById(departmentId: number, departments: Department[]): Department | undefined {
  return departments.find(d => d.id === departmentId);
}

/**
 * Default department data for fallback
 */
export const defaultDepartments: Department[] = [
  {
    id: 1,
    name: "Engineering",
    description: "Design and build cutting-edge satellite hardware and systems that operate in the harsh conditions of space.",
    icon: "cogs",
    color: "#4D9DE0",
    requirements: ["Bachelor's degree in Aerospace/Mechanical Engineering", "Experience with CAD software", "Knowledge of spacecraft systems"],
    responsibilities: ["Design satellite components", "Test hardware performance", "Collaborate with interdisciplinary teams"]
  },
  {
    id: 2,
    name: "Communications",
    description: "Develop and maintain advanced communication systems that connect our satellites with ground stations.",
    icon: "satellite-dish",
    color: "#F46036",
    requirements: ["Degree in Electrical Engineering or related field", "RF communications experience", "Signal processing knowledge"],
    responsibilities: ["Design communication protocols", "Implement signal processing algorithms", "Maintain ground station links"]
  },
  {
    id: 3,
    name: "Data Science",
    description: "Analyze and interpret the vast amounts of data collected by our satellite systems for valuable insights.",
    icon: "chart-bar",
    color: "#7B5EA7",
    requirements: ["Statistics or Computer Science degree", "Experience with Python and data analysis", "Machine learning expertise"],
    responsibilities: ["Develop data processing pipelines", "Create ML models for satellite data", "Generate insights from collected data"]
  }
];
