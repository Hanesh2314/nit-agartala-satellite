import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { insertApplicantSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

// Setup multer for file uploads (storing in memory temporarily)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only specific file types
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Departments routes
  app.get("/api/departments", async (req: Request, res: Response) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ error: "Failed to fetch departments" });
    }
  });

  app.get("/api/departments/:id", async (req: Request, res: Response) => {
    try {
      const departmentId = parseInt(req.params.id);
      if (isNaN(departmentId)) {
        return res.status(400).json({ error: "Invalid department ID" });
      }
      
      const department = await storage.getDepartment(departmentId);
      if (!department) {
        return res.status(404).json({ error: "Department not found" });
      }
      
      res.json(department);
    } catch (error) {
      console.error("Error fetching department:", error);
      res.status(500).json({ error: "Failed to fetch department" });
    }
  });

  // Applicant routes
  app.post("/api/applicants", upload.single('resume'), async (req: Request, res: Response) => {
    try {
      // Parse and validate form data
      const formData = req.body;
      
      // Convert departmentId to number
      formData.departmentId = parseInt(formData.departmentId);
      
      // Validate with Zod schema
      const result = insertApplicantSchema.safeParse(formData);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }
      
      // Create applicant with file if provided
      const newApplicant = await storage.createApplicant(
        result.data, 
        req.file
      );
      
      res.status(201).json(newApplicant);
    } catch (error) {
      console.error("Error creating applicant:", error);
      res.status(500).json({ error: "Failed to create applicant record" });
    }
  });

  // Protected admin routes
  app.get("/api/admin/applicants", async (req: Request, res: Response) => {
    // In a real app, this would be protected by authentication middleware
    // For this demo, we're using a simple admin password in the frontend
    try {
      const applicants = await storage.getApplicants();
      res.json(applicants);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      res.status(500).json({ error: "Failed to fetch applicants" });
    }
  });

  app.delete("/api/admin/applicants/:id", async (req: Request, res: Response) => {
    try {
      const applicantId = parseInt(req.params.id);
      if (isNaN(applicantId)) {
        return res.status(400).json({ error: "Invalid applicant ID" });
      }
      
      const success = await storage.deleteApplicant(applicantId);
      if (!success) {
        return res.status(404).json({ error: "Applicant not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting applicant:", error);
      res.status(500).json({ error: "Failed to delete applicant" });
    }
  });

  // About Us routes
  app.get("/api/about", async (req: Request, res: Response) => {
    try {
      const aboutContent = await storage.getAboutUs();
      res.json(aboutContent || { content: "Default about us content." });
    } catch (error) {
      console.error("Error fetching about us content:", error);
      res.status(500).json({ error: "Failed to fetch about us content" });
    }
  });

  app.put("/api/admin/about", async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: "Content is required" });
      }
      
      const updated = await storage.updateAboutUs(content);
      res.json(updated);
    } catch (error) {
      console.error("Error updating about us content:", error);
      res.status(500).json({ error: "Failed to update about us content" });
    }
  });

  // Default seed data for departments if none exist
  try {
    const departments = await storage.getDepartments();
    if (departments.length === 0) {
      // Seed departments
      const departmentData = [
        {
          name: "Engineering", 
          description: "Design and build cutting-edge satellite hardware and systems that operate in the harsh conditions of space.",
          icon: "cogs", 
          color: "#4D9DE0",
          requirements: ["Bachelor's degree in Aerospace/Mechanical Engineering", "Experience with CAD software", "Knowledge of spacecraft systems"],
          responsibilities: ["Design satellite components", "Test hardware performance", "Collaborate with interdisciplinary teams"]
        },
        {
          name: "Communications", 
          description: "Develop and maintain advanced communication systems that connect our satellites with ground stations.",
          icon: "satellite-dish", 
          color: "#F46036",
          requirements: ["Degree in Electrical Engineering or related field", "RF communications experience", "Signal processing knowledge"],
          responsibilities: ["Design communication protocols", "Implement signal processing algorithms", "Maintain ground station links"]
        },
        {
          name: "Data Science", 
          description: "Analyze and interpret the vast amounts of data collected by our satellite systems for valuable insights.",
          icon: "chart-bar", 
          color: "#7B5EA7",
          requirements: ["Statistics or Computer Science degree", "Experience with Python and data analysis", "Machine learning expertise"],
          responsibilities: ["Develop data processing pipelines", "Create ML models for satellite data", "Generate insights from collected data"]
        }
      ];
      
      for (const dept of departmentData) {
        await storage.createDepartment(dept);
      }
      console.log("Seeded initial departments");
    }
  } catch (error) {
    console.error("Error seeding departments:", error);
  }

  const httpServer = createServer(app);
  return httpServer;
}
