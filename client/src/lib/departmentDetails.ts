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
    name: "POWER SYSTEM",
    description: "Design and build the power generation, storage, and distribution systems for satellite operations in space.",
    icon: "bolt",
    color: "#4D9DE0",
    requirements: ["Knowledge of electrical circuits", "Experience with solar panels and battery systems", "Understanding of power management"],
    responsibilities: ["Design power supply architecture", "Implement efficient energy harvesting", "Ensure continuous power for all satellite systems"]
  },
  {
    id: 2,
    name: "ON-BOARD COMPUTER",
    description: "Develop the central processing unit that controls all the satellite's functions and operations.",
    icon: "microchip",
    color: "#F46036",
    requirements: ["Programming skills", "Hardware interfacing knowledge", "Real-time operating systems experience"],
    responsibilities: ["Create fault-tolerant systems", "Program satellite command sequences", "Manage data processing and storage"]
  },
  {
    id: 3,
    name: "COMMUNICATION SYSTEM",
    description: "Build the systems that allow the satellite to send and receive data with ground stations on Earth.",
    icon: "satellite-dish",
    color: "#7B5EA7",
    requirements: ["RF and antenna design knowledge", "Signal processing experience", "Communication protocols understanding"],
    responsibilities: ["Design transceiver systems", "Optimize bandwidth usage", "Implement error correction algorithms"]
  },
  {
    id: 4,
    name: "ATTITUDE DETERMINATION & CONTROL SYSTEM",
    description: "Create the systems that determine and control the satellite's orientation and position in orbit.",
    icon: "compass",
    color: "#2ECC71",
    requirements: ["Knowledge of control systems", "Experience with sensors and actuators", "Understanding of orbital mechanics"],
    responsibilities: ["Design stabilization systems", "Implement precise positioning algorithms", "Manage altitude control mechanisms"]
  }
];
